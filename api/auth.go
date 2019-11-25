package api

import (
	"encoding/json"
	"fmt"
	"github.com/iis_project/app"
	"github.com/satori/go.uuid"
	"io/ioutil"
	"net/http"
	"time"
	"github.com/dgrijalva/jwt-go"
)

type LoginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

//func (a *API) LoginHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
//	var input LoginInput
//
//	defer r.Body.Close()
//	body, err := ioutil.ReadAll(r.Body)
//	if err != nil {
//		http.Error(w, "cannot read body data", http.StatusBadRequest)
//	}
//
//	if err := json.Unmarshal(body, &input); err != nil {
//		http.Error(w, "cannot unmarshal login data", http.StatusBadRequest)
//	}
//
//	user, err := a.App.GetUserByEmail(input.Username)
//
//	if user == nil || err != nil {
//		if err != nil {
//			ctx.Logger.WithError(err).Error("unable to get user")
//		}
//		http.Error(w, "invalid credentials", http.StatusForbidden)
//	}
//
//	if ok := user.CheckPassword(input.Password); !ok {
//		http.Error(w, "invalid credentials", http.StatusForbidden)
//	}
//
//	sess, err := a.App.GlobalSessions.SessionStart(w, r)
//	defer sess.SessionRelease(w)
//
//	cookie := &http.Cookie{
//		Name:     "gosessionid",
//		Value:    url.QueryEscape(sess.SessionID()),
//		Path:     "/",
//		HttpOnly: true,
//		Secure:   false,
//		Domain:   "random",
//	}
//	cookie.MaxAge = 3600
//	cookie.Expires = time.Now().Add(time.Duration(3600) * time.Second)
//	http.SetCookie(w, cookie)
//	r.AddCookie(cookie)
//	r.Header.Set("gosessionid", sess.SessionID())
//	w.Header().Set("gosessionid", sess.SessionID())
//
//	err = ctx.Database.UpdateUserSid(input.Username, sess.SessionID())
//
//	user, err = a.App.GetUserByEmail(input.Username)
//	if user == nil || err != nil {
//		if err != nil {
//			ctx.Logger.WithError(err).Error("unable to get user")
//		}
//		return err
//	}
//
//	data, err := json.Marshal(user)
//	if err != nil {
//		return err
//	}
//	_, err = w.Write(data)
//
//	return err
//}

func (a *API) LoginHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input LoginInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		//http.Error(w, "cannot read body data", http.StatusBadRequest)
		ctx.Logger.WithError(err).Error("cannot read body data")
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		//http.Error(w, "cannot unmarshal login data", http.StatusBadRequest)
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

	// Create a new random session token
	sessionToken := uuid.NewV4().String()
	// Set the token in the cache, along with the user whom it represents
	// The token has an expiry time of 120 seconds
	_, err = a.App.RedisCache.Do("SETEX", sessionToken, "120", input.Username)
	if err != nil {
		// If there is an error in setting the cache, return an internal server error
		//w.WriteHeader(http.StatusInternalServerError)
		ctx.Logger.WithError(err).Error("unable to set token in redis")
		return err
	}

	// Finally, we set the client cookie for "session_token" as the session token we just generated
	// we also set an expiry time of 120 seconds, the same as the cache
	cookie := &http.Cookie{
		Name:    "gosessionid",
		Value:   sessionToken,
		Expires: time.Now().Add(3600 * time.Second),
		Domain: "localhost",
	}

	http.SetCookie(w, cookie)
	r.AddCookie(cookie)
	r.Header.Set("gosessionid", sessionToken)
	w.Header().Set("gosessionid", sessionToken)

	user, err = a.App.Database.GetUserByEmail(input.Username)
	if user == nil || err != nil {
		if err != nil {
			ctx.Logger.WithError(err).Error("unable to get user")
		}
		return err
	}

	data, err := json.Marshal(user)
	if err != nil {
		return err
	}
	_, err = w.Write(data)

	return err
}

// User ...
// Custom object which can be stored in the claims
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthToken ...
// This is what is retured to the user
type AuthToken struct {
	TokenType string `json:"token_type"`
	Token     string `json:"access_token"`
	ExpiresIn int64  `json:"expires_in"`
}

// AuthTokenClaim ...
// This is the cliam object which gets parsed from the authorization header
type AuthTokenClaim struct {
	*jwt.StandardClaims
	User
}

func (a *API) loginJwtHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
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

	expiresAt := time.Now().Add(time.Minute * 10).Unix()
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims = &AuthTokenClaim{
		&jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
		User{input.Username, input.Password},
	}

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(AuthToken{
		Token:     tokenString,
		TokenType: "Bearer",
		ExpiresIn: expiresAt,
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
