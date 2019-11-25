package api

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/iis_project/app"
	"github.com/mitchellh/mapstructure"
	"github.com/satori/go.uuid"
	"io/ioutil"
	"net/http"
	"time"
)

type LoginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// retured to the user
type AuthToken struct {
	TokenType string `json:"token_type"`
	Token     string `json:"access_token"`
	ExpiresIn int64  `json:"expires_in"`
}

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Username string `json:"username"`
	Role string `json:"role"`
	jwt.StandardClaims
}

var jwtKey = []byte("my_secret_key")

func (a *API) loginHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input LoginInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		ctx.Logger.WithError(err).Error("cannot read body data")
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		ctx.Logger.WithError(err).Error("cannot unmarshal login data")
		return err
	}

	user, err := a.App.Database.GetUserByEmail(input.Username)
	if user == nil || err != nil {
		if err != nil {
			ctx.Logger.WithError(err).Error("unable to get user")
		}
		return err
	}

	if ok := user.CheckPassword(input.Password); !ok {
		ctx.Logger.WithError(err).Error("password check failed")
		return ctx.AuthorizationError()
	}

	// Declare the expiration time of the token
	// here, we have kept it as 5 minutes
	expirationTime := time.Now().Add(100 * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &Claims{
		Username: input.Username,
		Role: user.Role,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		//return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(AuthToken{
		Token:     tokenString,
		TokenType: "Bearer",
		ExpiresIn: expirationTime.Unix(),
	})

	return err
}

func (a *API) RefreshHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	c, err := r.Cookie("gosessionid")
	if err != nil {
		if err == http.ErrNoCookie {
			//http.Error(w, "oihih", http.StatusUnauthorized)
			ctx.Logger.WithError(err).Error("no cookie in request")
		} else {
			ctx.Logger.Error(err)
		}
		return err
	}

	sessionToken := c.Value

	response, err := a.App.RedisCache.Do("GET", sessionToken)
	if err != nil {
		//http.Error(w, "", http.StatusInternalServerError)
		ctx.Logger.Error(err)
		return err
	}
	if response == nil {
		http.Error(w, "", http.StatusUnauthorized)
		return ctx.AuthorizationError()
	}

	// Now, create a new session token for the current user
	newSessionToken := uuid.NewV4().String()
	_, err = a.App.RedisCache.Do("SETEX", newSessionToken, "120", fmt.Sprintf("%s",response))
	if err != nil {
		//http.Error(w, "", http.StatusInternalServerError)
		ctx.Logger.Error(err)
		return err
	}

	// Delete the older session token
	_, err = a.App.RedisCache.Do("DEL", sessionToken)
	if err != nil {
		//http.Error(w, "", http.StatusInternalServerError)
		ctx.Logger.Error(err)
		return err
	}

	// Set the new token as the users `session_token` cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "gosessionid",
		Value:   newSessionToken,
		Expires: time.Now().Add(3600 * time.Second),
	})

	return err
}

func (a *API) validateJwtToken(tokenString string, ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		ctx.Logger.WithError(err).Warn("couldn't parse jwt token")
		return err
	}

	if token.Valid {
		var claims Claims
		err := mapstructure.Decode(token.Claims, &claims)
		if err != nil {
			ctx.Logger.WithError(err).Warn("couldn't decode claims")
			return err
		}

		user, err := a.App.Database.GetUserByEmail(claims.Username)
		if err != nil {
			ctx.Logger.Warn("user not found by email")
		}

		ctx.Logger.Info(fmt.Sprintf("successfully verified jwt token for user %s", claims.Username))
		ctx = ctx.WithUser(user)
	} else {
		ctx.Logger.Info("jwt token for is not valid")
		w.WriteHeader(http.StatusUnauthorized)
		return err
	}
	return err
}