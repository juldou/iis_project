package api

import (
	"encoding/json"
	"github.com/iis_project/backend/app"
	"github.com/iis_project/backend/model"
	"io/ioutil"
	"net/http"
)

func (a *API) GetUserById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	todo, err := ctx.GetUserById(id)
	if err != nil {
		return err
	}

	data, err := json.Marshal(todo)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) GetUsers(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	role := r.FormValue("role")

	users, err := ctx.GetUsers(role)
	if err != nil {
		return err
	}

	data, err := json.Marshal(users)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UserInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateUser(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input UserInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	user := &model.User{
		Email: input.Email,
		Role:  input.Role,
	}

	if err := ctx.CreateUser(user, input.Password); err != nil {
		return err
	}

	data, err := json.Marshal(&RestaurantUserResponse{Id: user.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UpdateUserInput struct {
	Password *string `json:"password"`
	Role     *string `json:"role"`
}

type UpdateUserResponse struct {
	Id uint `json:"id"`
}

func (a *API) UpdateUserById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	var input UpdateUserInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	existingUser, err := ctx.GetUserById(id)
	if err != nil || existingUser == nil {
		return err
	}

	if input.Password != nil {
		if err := existingUser.SetPassword(*input.Password); err != nil {
			return err
		}
	}
	if input.Role != nil {
		existingUser.Role = *input.Role
	}

	err = ctx.UpdateUser(existingUser)
	if err != nil {
		return err
	}

	data, err := json.Marshal(existingUser)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) DeleteUserById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	existingUser, err := ctx.GetUserById(id)
	if err != nil || existingUser == nil {
		return err
	}
	if err := ctx.DeleteUser(existingUser); err != nil {
		return err
	}
	return err
}
