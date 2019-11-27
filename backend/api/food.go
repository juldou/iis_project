package api

import (
	"encoding/json"
	"fmt"
	"github.com/iis_project/backend/app"
	"github.com/iis_project/backend/model"
	"io"
	"io/ioutil"
	"net/http"
	"os"
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

func (a *API) GetAllOrdersByUser(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	orders, err := ctx.GetAllOrdersForUser()
	if err != nil {
		return err
	}

	data, err := json.Marshal(orders)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) GetFoodsByRestaurantId(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	foods, err := ctx.GetFoodsByRestaurantId(id)
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
	Price       uint   `json:"price"`
	Description string `json:"description"`
	PictureUrl  string `json:"picture_url"`
}

type FoodUserResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateFood(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	var input FoodInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	food := &model.Food{
		Category:     input.Category,
		Name:         input.Name,
		Price:        input.Price,
		Description:  input.Description,
		PictureUrl:   input.PictureUrl,
		RestaurantId: id,
		IsSoldout:    false,
	}

	if err := ctx.CreateFood(food); err != nil {
		return err
	}

	menu := &model.Menu{
		Name: "permanent",
		Food: *food,
	}

	if err := ctx.CreateMenu(menu); err != nil {
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
	Category     *string `json:"category"`
	Name         *string `json:"name"`
	Price        *uint   `json:"price"`
	Description  *string `json:"description"`
	PictureUrl   *string `json:"picture_url"`
	RestaurantId *uint   `json:"restaurant_id"`
	IsSoldout    *bool   `json:"is_soldout"`
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
	if input.Price != nil {
		existingFood.Price = *input.Price
	}
	if input.Description != nil {
		existingFood.Description = *input.Description
	}
	if input.PictureUrl != nil {
		existingFood.PictureUrl = *input.PictureUrl
	}
	if input.RestaurantId != nil {
		existingFood.RestaurantId = *input.RestaurantId
	}
	if input.IsSoldout != nil {
		existingFood.IsSoldout = *input.IsSoldout
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

func (a *API) DeleteFoodById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	existingFood, err := ctx.GetFoodById(id)
	if err != nil || existingFood == nil {
		return err
	}
	if err := ctx.DeleteFood(existingFood); err != nil {
		return err
	}
	return err
}

func (a *API) GetFoodCategories(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	foodCategories, err := ctx.GetFoodCategories()

	if err != nil {
		return err
	}

	data, err := json.Marshal(foodCategories)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) AddFoodPicture(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	existingFood, err := ctx.GetFoodById(id)
	if err != nil || existingFood == nil {
		return err
	}

	if err := r.ParseMultipartForm(5 * 1024 * 1024 * 1024 /* 5MB */); err != nil {
		return err
	}
	file, _, err := r.FormFile("file")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fileName := fmt.Sprintf("%d.png", id)
	filePath := "../frontend/iis/public/foods/" + fileName

	f, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer f.Close()

	if _, err := io.Copy(f, file); err != nil {
		return err
	}

	existingFood.PictureUrl = fileName

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
