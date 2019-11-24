package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"runtime/debug"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"

	"github.com/iis_project/app"
	"github.com/iis_project/model"
)

type statusCodeRecorder struct {
	http.ResponseWriter
	http.Hijacker
	StatusCode int
}

func (r *statusCodeRecorder) WriteHeader(statusCode int) {
	r.StatusCode = statusCode
	r.ResponseWriter.WriteHeader(statusCode)
}

type API struct {
	App    *app.App
	Config *Config
}

func New(a *app.App) (api *API, err error) {
	api = &API{App: a}
	api.Config, err = InitConfig()
	if err != nil {
		return nil, err
	}
	return api, nil
}

func (a *API) Init(r *mux.Router) {
	//r.Handle("/hello/", gziphandler.GzipHandler(a.handler(a.NotImplementedHandler))).Methods("GET")

	loginRouter := r.PathPrefix("/login").Subrouter()
	loginRouter.Handle("", a.handler(a.LoginHandler)).Methods("POST")

	// restaurant methods
	restaurantRouter := r.PathPrefix("/restaurant").Subrouter()
	restaurantRouter.Handle("", a.handler(a.CreateRestaurant)).Methods("POST")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.GetRestaurantById)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateRestaurantById)).Methods("PATCH")
	restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.CreateFood)).Methods("POST")
	restaurantRouter.Handle("/{id:[0-9]+}/foods", a.handler(a.GetFoodsByRestaurantId)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}/menu", a.handler(a.GetMenuByRestaurantId)).Methods("GET")

	// restaurants methods
	restaurantsRouter := r.PathPrefix("/restaurants").Subrouter()
	restaurantsRouter.Handle("", a.handler(a.GetRestaurants)).Methods("GET")

	// restaurant-categories methods
	restaurantCategoriesRouter := r.PathPrefix("/restaurant-categories").Subrouter()
	restaurantCategoriesRouter.Handle("", a.handler(a.GetRestaurantCategories)).Methods("GET")
}

func (a *API) handler(f func(*app.Context, http.ResponseWriter, *http.Request) error) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, 100*1024*1024)

		beginTime := time.Now()

		hijacker, _ := w.(http.Hijacker)
		w = &statusCodeRecorder{
			ResponseWriter: w,
			Hijacker:       hijacker,
		}

		ctx := a.App.NewContext().WithRemoteAddress(a.IPAddressForRequest(r))
		ctx = ctx.WithLogger(ctx.Logger.WithField("request_id", base64.RawURLEncoding.EncodeToString(model.NewId())))

		// We can obtain the session token from the requests cookies, which come with every request
		c, err := r.Cookie("gosessionid")
		if err != nil {
			if err == http.ErrNoCookie {
				// If the cookie is not set, return an unauthorized status
				//w.WriteHeader(http.StatusUnauthorized)
				ctx.Logger.Info("cookies not found in request")
				//return
			} else {
				// For any other type of error, return a bad request status
				//w.WriteHeader(http.StatusBadRequest)
				return
			}
		} else {
			sessionToken := c.Value
			// We then get the name of the user from our cache, where we set the session token
			response, err := a.App.RedisCache.Do("GET", sessionToken)
			if err != nil {
				// If there is an error fetching from cache, return an internal server error status
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			if response == nil {
				// If the session token is not present in cache, return an unauthorized error
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			// Finally, return the welcome message to the user
			user, err := a.App.GetUserByEmail(fmt.Sprintf("%s", response))
			if err != nil {
				ctx.Logger.Info("user not found by email")
			}
			ctx.Logger.Info(fmt.Sprintf("successfully loaded session token for %s", response))
			ctx = ctx.WithUser(user)
		}



		//cookie, err := r.Cookie("gosessionid")
		//if err != nil {
		//	if err == http.ErrNoCookie {
		//		ctx.Logger.Info("cookies not found in request")
		//	}
		//} else {
		//	if a.App.GlobalSessions.GetProvider().SessionExist(cookie.Value) {
		//		user, err := a.App.GetUserBySid(cookie.Value)
		//		if user == nil || err != nil {
		//			if err != nil {
		//				ctx.Logger.WithError(err).Error("unable to get user")
		//			}
		//			http.Error(w, "invalid credentials", http.StatusForbidden)
		//			return
		//		}
		//		ctx = ctx.WithUser(user)
		//	}
		//}

		//if username, password, ok := r.BasicAuth(); ok {
		//	user, err := a.App.GetUserByEmail(username)
		//
		//	if user == nil || err != nil {
		//		if err != nil {
		//			ctx.Logger.WithError(err).Error("unable to get user")
		//		}
		//		http.Error(w, "invalid credentials", http.StatusForbidden)
		//		return
		//	}
		//
		//	if ok := user.CheckPassword(password); !ok {
		//		http.Error(w, "invalid credentials", http.StatusForbidden)
		//		return
		//	}
		//
		//	sess, err := a.App.GlobalSessions.SessionStart(w, r)
		//	defer sess.SessionRelease(w)
		//	username := sess.Get("username")
		//	fmt.Println(username)
		//
		//	ctx = ctx.WithUser(user)
		//}

		ctx = ctx.WithDatabase(a.App.Database)

		defer func() {
			statusCode := w.(*statusCodeRecorder).StatusCode
			if statusCode == 0 {
				statusCode = 200
			}
			duration := time.Since(beginTime)

			logger := ctx.Logger.WithFields(logrus.Fields{
				"duration":    duration,
				"status_code": statusCode,
				"remote":      ctx.RemoteAddress,
			})
			logger.Info(r.Method + " " + r.URL.RequestURI())
		}()

		defer func() {
			if r := recover(); r != nil {
				ctx.Logger.Error(fmt.Errorf("%v: %s", r, debug.Stack()))
				http.Error(w, "internal server error", http.StatusInternalServerError)
			}
		}()

		w.Header().Set("Content-Type", "application/json")

		if err := f(ctx, w, r); err != nil {
			if verr, ok := err.(*app.ValidationError); ok {
				data, err := json.Marshal(verr)
				if err == nil {
					w.WriteHeader(http.StatusBadRequest)
					_, err = w.Write(data)
				}

				if err != nil {
					ctx.Logger.Error(err)
					http.Error(w, "internal server error", http.StatusInternalServerError)
				}
			} else if uerr, ok := err.(*app.UserError); ok {
				data, err := json.Marshal(uerr)
				if err == nil {
					w.WriteHeader(uerr.StatusCode)
					_, err = w.Write(data)
				}

				if err != nil {
					ctx.Logger.Error(err)
					http.Error(w, "internal server error", http.StatusInternalServerError)
				}
			} else {
				ctx.Logger.Error(err)
				http.Error(w, "internal server error", http.StatusInternalServerError)
			}
		}
	})
}

func (a *API) NotImplementedHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	_, err := w.Write([]byte(`{"Not" : "Implemented"}`))
	return err
}

func (a *API) IPAddressForRequest(r *http.Request) string {
	addr := r.RemoteAddr
	if a.Config.ProxyCount > 0 {
		h := r.Header.Get("X-Forwarded-For")
		if h != "" {
			clients := strings.Split(h, ",")
			if a.Config.ProxyCount > len(clients) {
				addr = clients[0]
			} else {
				addr = clients[len(clients)-a.Config.ProxyCount]
			}
		}
	}
	return strings.Split(strings.TrimSpace(addr), ":")[0]
}
