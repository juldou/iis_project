package api

import (
	"encoding/json"
	"github.com/gorilla/schema"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
)

type Filter struct {
	Name     string `schema:"name"`
	Category string `schema:"category"`
}

func (a *API) GetMenuByRestaurantId(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	restaurantId := getIdFromRequest(r)

	if err := r.ParseForm(); err != nil {
		return err
	}

	filter := new(Filter)
	if err := schema.NewDecoder().Decode(filter, r.Form); err != nil {
		return err
	}

	foods, err := ctx.GetMenuByRestaurantId(restaurantId, filter.Name, filter.Category)

	if err != nil {
		return err
	}

	data, err := json.Marshal(foods)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type MenuInput struct {
	Name   string `json:"name"`
	FoodId uint   `json:"food_id"`
}

type MenuResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateMenu(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input MenuInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	menu := &model.Menu{
		Name:   input.Name,
		FoodId: input.FoodId,
	}

	if err := ctx.CreateMenu(menu); err != nil {
		return err
	}

	data, err := json.Marshal(&FoodUserResponse{Id: menu.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) DeleteMenuById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	existingMenu, err := ctx.GetMenuById(id)
	if err != nil || existingMenu == nil {
		return err
	}
	if err := ctx.DeleteMenu(existingMenu); err != nil {
		return err
	}
	return err
}
