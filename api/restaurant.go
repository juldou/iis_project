package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
)

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
	Name string `json:"name"`
	Description string `json:"description"`
	PictureUrl string `json:"picture_url"`
}

type UserResponse struct {
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
		Category: input.Category,
		Name: input.Name,
		Description: input.Description,
		PictureUrl: input.PictureUrl,
	}

	if err := ctx.CreateRestaurant(restaurant); err != nil {
		return err
	}

	data, err := json.Marshal(&UserResponse{Id: restaurant.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}
