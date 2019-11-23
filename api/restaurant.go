package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
	"strconv"
)

func (a *API) GetRestaurantById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	todo, err := ctx.GetRestaurantById(id)
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

func (a *API) GetRestaurants(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	restaurants, err := ctx.Database.GetRestaurants()
	if err != nil {
		return err
	}

	data, err := json.Marshal(restaurants)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) GetRestaurantCategories(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	restaurantCategories, err := ctx.Database.GetRestaurantCategories()

	if err != nil {
		return err
	}

	data, err := json.Marshal(restaurantCategories)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type RestaurantInput struct {
	Category    string `json:"category"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PictureUrl  string `json:"picture_url"`
}

type RestaurantUserResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateRestaurant(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input RestaurantInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	restaurant := &model.Restaurant{
		Category:    input.Category,
		Name:        input.Name,
		Description: input.Description,
		PictureUrl:  input.PictureUrl,
	}

	if err := ctx.CreateRestaurant(restaurant); err != nil {
		return err
	}

	data, err := json.Marshal(&RestaurantUserResponse{Id: restaurant.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UpdateRestaurantInput struct {
	Category    *string `json:"category"`
	Name        *string `json:"name"`
	Description *string `json:"description"`
	PictureUrl  *string `json:"picture_url"`
}

func (a *API) UpdateRestaurantById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	var input UpdateRestaurantInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	existingRestaurant, err := ctx.GetRestaurantById(id)
	if err != nil || existingRestaurant == nil {
		return err
	}

	if input.Category != nil {
		existingRestaurant.Category = *input.Category
	}
	if input.Name != nil {
		existingRestaurant.Name = *input.Name
	}
	if input.Description != nil {
		existingRestaurant.Description = *input.Description
	}
	if input.PictureUrl != nil {
		existingRestaurant.PictureUrl = *input.PictureUrl
	}

	err = ctx.UpdateRestaurant(existingRestaurant)
	if err != nil {
		return err
	}

	data, err := json.Marshal(existingRestaurant)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
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
