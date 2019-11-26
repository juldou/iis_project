package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/casbin/casbin"
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
	App      *app.App
	Enforcer *casbin.Enforcer
	Config   *Config
}

func New(a *app.App) (api *API, err error) {
	api = &API{App: a}
	api.Config, err = InitConfig()
	if err != nil {
		return nil, err
	}
	e := casbin.NewEnforcer(api.Config.EnforcerModelPath, api.Config.EnforcerPolicyPath)
	api.Enforcer = e
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
	orderRouter.Handle("/{id:[0-9]+}", a.handler(a.GetOrderById)).Methods("GET")
	orderRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateOrderById)).Methods("PATCH")
	orderRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteOrderById)).Methods("DELETE")
	orderRouter.Handle("/{id:[0-9]+}/foods", a.handler(a.GetAllFoodsByOrderId)).Methods("GET")

	ordersRouter := r.PathPrefix("/orders").Subrouter()
	ordersRouter.Handle("", a.handler(a.GetAllOrdersByUser)).Methods("GET")

	// login method
	loginRouter := r.PathPrefix("/login").Subrouter()
	loginRouter.Handle("", a.handler(a.loginHandler)).Methods("POST")

	// refresh method
	refreshRouter := r.PathPrefix("/refresh").Subrouter()
	refreshRouter.Handle("", a.handler(a.refreshToken)).Methods("GET")

	// restaurant methods
	restaurantRouter := r.PathPrefix("/restaurant").Subrouter()
	restaurantRouter.Handle("", a.handler(a.CreateRestaurant)).Methods("POST")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.GetRestaurantById)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateRestaurantById)).Methods("PATCH") // only operator and admin
	restaurantRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteRestaurantById)).Methods("DELETE")
	restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.CreateFood)).Methods("POST")
	//restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.UpdateFoodById)).Methods("PATCH")
	//restaurantRouter.Handle("/{id:[0-9]+}/food", a.handler(a.DeleteFoodById)).Methods("DELETE")
	restaurantRouter.Handle("/{id:[0-9]+}/foods", a.handler(a.GetFoodsByRestaurantId)).Methods("GET")
	restaurantRouter.Handle("/{id:[0-9]+}/menu", a.handler(a.GetMenuByRestaurantId)).Methods("GET")

	menuRouter := r.PathPrefix("/menu").Subrouter()
	menuRouter.Handle("", a.handler(a.CreateMenu)).Methods("POST")

	foodRouter := r.PathPrefix("/food").Subrouter()
	foodRouter.Handle("/{id:[0-9]+}", a.handler(a.GetFoodById)).Methods("GET")
	foodRouter.Handle("/{id:[0-9]+}", a.handler(a.UpdateFoodById)).Methods("PATCH")
	foodRouter.Handle("/{id:[0-9]+}", a.handler(a.DeleteFoodById)).Methods("DELETE")

	// restaurants methods
	restaurantsRouter := r.PathPrefix("/restaurants").Subrouter()
	restaurantsRouter.Handle("", a.handler(a.GetRestaurants)).Methods("GET")

	// restaurant-categories methods
	restaurantCategoriesRouter := r.PathPrefix("/restaurant-categories").Subrouter()
	restaurantCategoriesRouter.Handle("", a.handler(a.GetRestaurantCategories)).Methods("GET")

	foodCategoriesRouter := r.PathPrefix("/food-categories").Subrouter()
	foodCategoriesRouter.Handle("", a.handler(a.GetFoodCategories)).Methods("GET")
}

// TODO: orders_allowed do restauracie

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

		defer func() {
			statusCode := w.(*statusCodeRecorder).StatusCode
			if statusCode == 0 {
				statusCode = 200
			}
			duration := time.Since(beginTime)

			logger := ctx.Logger.WithFields(logrus.Fields{
				"time":        fmt.Sprintf("%d:%d:%d", time.Now().Hour(), time.Now().Minute(), time.Now().Second()),
				"duration":    duration,
				"status_code": statusCode,
				"remote":      ctx.RemoteAddress,
			})
			logger.Info(r.Method + " " + r.URL.RequestURI())
		}()

		authorization := r.Header.Get("Authorization")
		if authorization != "" {
			splitAuthorization := strings.Split(authorization, "Bearer")
			if len(splitAuthorization) == 2 {
				tokenString := strings.TrimSpace(splitAuthorization[1])
				claims := jwt.MapClaims{}
				token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
					return a.Config.JwtSecret, nil
				})
				if err != nil {
					ctx.Logger.WithError(err).Warn("couldn't parse jwt token with claims")
					w.WriteHeader(http.StatusUnauthorized)
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

		var sub string // the user that wants to access a resource.
		if ctx.User != nil {
			sub = ctx.User.Role
		} else {
			sub = "guest"
		}
		obj := r.URL.RequestURI()[4:] // the resource that is going to be accessed.
		act := r.Method           // the operation that the user performs on the resource.

		if res := a.Enforcer.Enforce(sub, obj, act); res {
			// permit
		} else {
			// deny the request, show an error
			http.Error(w, "user with given jwt token cannot perform the api call", http.StatusForbidden)
			return
		}

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
