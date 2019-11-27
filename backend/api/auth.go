package api

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/iis_project/backend/app"
	"github.com/iis_project/backend/model"
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
	Role     string `json:"role"`
	jwt.StandardClaims
}

type LoginResponse struct {
	User      *model.User
	AuthToken AuthToken
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
		Role:     user.Role,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(a.Config.JwtSecret)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		//return
	}

	w.Header().Set("Content-Type", "application/json")
	loginResponse := &LoginResponse{
		User: user,
		AuthToken: AuthToken{
			Token:     tokenString,
			TokenType: "Bearer",
			ExpiresIn: expirationTime.Unix(),
		},
	}

	data, err := json.Marshal(loginResponse)
	if err != nil {
		return err
	}
	_, err = w.Write(data)

	return err
}

func (a *API) refreshToken(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	if ctx.User == nil {
		ctx.Logger.Error("refresh failed because there is no valid token in request")
		return ctx.AuthorizationError()
	}

	// Declare the expiration time of the token
	// here, we have kept it as 5 minutes
	expirationTime := time.Now().Add(100 * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &Claims{
		Username: ctx.User.Email,
		Role:     ctx.User.Role,
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
	loginResponse := &LoginResponse{
		User: ctx.User,
		AuthToken: AuthToken{
			Token:     tokenString,
			TokenType: "Bearer",
			ExpiresIn: expirationTime.Unix(),
		},
	}

	data, err := json.Marshal(loginResponse)
	if err != nil {
		return err
	}
	_, err = w.Write(data)

	return err
}

type RegisterInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Street   string `json:"street"`
	City     string `json:"city"`
}

type RegisterResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateRegistration(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input RegisterInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	address := &model.Address{
		Street: input.Street,
		City:   input.City,
	}

	if err := ctx.CreateAddress(address); err != nil {
		return err
	}

	user := &model.User{
		Email:   input.Email,
		Role:    "customer",
		AddressId: address.ID,
	}

	if err := ctx.CreateUser(user, input.Password); err != nil {
		return err
	}

	data, err := json.Marshal(&RegisterResponse{Id: user.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}
