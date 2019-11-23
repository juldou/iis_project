package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
)

func (a *API) GetFoodById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	food, err := ctx.GetFoodById(id)
	if err != nil {
		return err
	}

	data, err := json.Marshal(food)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) GetFoods(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	foods, err := ctx.Database.GetFoods()
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

type FoodInput struct {
	Category    string `json:"category"`
	Name        string `json:"name"`
	Description string `json:"description"`
	PictureUrl  string `json:"picture_url"`
	RestaurantId  uint `json:"restaurant_id"`
}

type FoodUserResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateFood(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input FoodInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	food := &model.Food {
		Category:       input.Category,
		Name:           input.Name,
		Description:    input.Description,
		PictureUrl:     input.PictureUrl,
		FkRestaurantId: input.RestaurantId,
	}

	if err := ctx.CreateFood(food); err != nil {
		return err
	}

	data, err := json.Marshal(&FoodUserResponse{Id: food.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UpdateFoodInput struct {
	Category    *string `json:"category"`
	Name        *string `json:"name"`
	Description *string `json:"description"`
	PictureUrl  *string `json:"picture_url"`
	RestaurantId  *uint `json:"restaurant_id"`
}

func (a *API) UpdateFoodById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	var input UpdateFoodInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	existingFood, err := ctx.GetFoodById(id)
	if err != nil || existingFood == nil {
		return err
	}

	if input.Category != nil {
		existingFood.Category = *input.Category
	}
	if input.Name != nil {
		existingFood.Name = *input.Name
	}
	if input.Description != nil {
		existingFood.Description = *input.Description
	}
	if input.PictureUrl != nil {
		existingFood.PictureUrl = *input.PictureUrl
	}
	if input.RestaurantId != nil {
		existingFood.FkRestaurantId = *input.RestaurantId
	}

	err = ctx.UpdateFood(existingFood)
	if err != nil {
		return err
	}

	data, err := json.Marshal(existingFood)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

//func getIdFromRequest(r *http.Request) uint {
//	vars := mux.Vars(r)
//	id := vars["id"]
//
//	intId, err := strconv.ParseInt(id, 10, 0)
//	if err != nil {
//		return 0
//	}
//
//	return uint(intId)
//}
