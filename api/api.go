package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/mitchellh/mapstructure"
	"net/http"
	"runtime/debug"
	"strconv"
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
	// user methods
	userRouter := r.PathPrefix("/user").Subrouter()
	userRouter.Handle("", a.handler(a.CreateUser)).Methods("POST")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.GetUserById)).Methods("GET")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateUserById)).Methods("PATCH")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteUserById)).Methods("DELETE")
	userRouter.Handle("/{id:[0-9]+}/address", a.handler(a.GetAllAddressesByUserId)).Methods("GET")
	userRouter.Handle("/{id:[0-9]+}/address", a.handler(a.CreateAddress)).Methods("POST")
	userRouter.Handle("/{id:[0-9]+}/address", a.handler(a.UpdateAddressById)).Methods("PATCH")
	userRouter.Handle("/{id:[0-9]+}/address", a.handler(a.DeleteAddressById)).Methods("DELETE")

	// users methods
	usersRouter := r.PathPrefix("/users").Subrouter()
	usersRouter.Handle("", a.handler(a.GetUsers)).Methods("GET")

	// order methods
	orderRouter := r.PathPrefix("/order").Subrouter()
	orderRouter.Handle("", a.handler(a.CreateOrder)).Methods("POST")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.GetOrderById)).Methods("GET")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateOrderById)).Methods("PATCH")
	userRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteOrderById)).Methods("DELETE")

	// login method
	loginRouter := r.PathPrefix("/login").Subrouter()
	loginRouter.Handle("", a.handler(a.loginHandler)).Methods("POST")

	// refresh method
	refreshRouter := r.PathPrefix("/refresh").Subrouter()
	refreshRouter.Handle("", a.handler(a.NotImplementedHandler)).Methods("GET")

	// restaurant methods
	restaurantRouter := r.PathPrefix("/restaurant").Subrouter()
	restaurantRouter.Handle("", a.handler(a.CreateRestaurant)).Methods("POST")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.GetRestaurantById)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateRestaurantById)).Methods("PATCH")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteRestaurantById)).Methods("DELETE")
	restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.CreateFood)).Methods("POST")
	restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.UpdateFoodById)).Methods("PATCH")
	restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.DeleteFoodById)).Methods("DELETE")
	restaurantRouter.Handle("/{id:[0-9]+}/foods", a.handler(a.GetFoodsByRestaurantId)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}/menu", a.handler(a.GetMenuByRestaurantId)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}/menu", a.handler(a.CreateMenu)).Methods("POST")

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
		ctx = ctx.WithDatabase(a.App.Database)

		authorization := r.Header.Get("Authorization")
		if authorization != "" {
			splitAuthorization := strings.Split(authorization, "Bearer")
			if len(splitAuthorization) == 2 {
				tokenString := strings.TrimSpace(splitAuthorization[1])
				claims := jwt.MapClaims{}
				token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
					return jwtKey, nil
				})
				if err != nil {
					ctx.Logger.WithError(err).Warn("couldn't parse jwt token with claims")
					return
				}

				if token.Valid {
					var claims Claims
					err := mapstructure.Decode(token.Claims, &claims)
					if err != nil {
						ctx.Logger.WithError(err).Warn("couldn't decode claims")
						return
					}

					user, err := a.App.Database.GetUserByEmail(claims.Username)
					if err != nil {
						ctx.Logger.Warn("user not found by email")
					}

					ctx.Logger.Info(fmt.Sprintf("successfully verified jwt token for user %s", claims.Username))
					ctx = ctx.WithUser(user)
				} else {
					w.WriteHeader(http.StatusUnauthorized)
					return
				}
			}
		}

		ctx = ctx.WithDatabase(a.App.Database)

		//defer func() {
		func() {
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

func getIdFromRequest(r *http.Request) uint {
	vars := mux.Vars(r)
	id := vars["id"]

	intId, err := strconv.ParseInt(id, 10, 0)
	if err != nil {
		return 0
	}

	return uint(intId)
}
