package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
)

func (a *API) GetOrderById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	food, err := ctx.GetOrderById(id)
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

func (a *API) GetAllFoodsByOrderId(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	foodIds, err := ctx.GetAllFoodsByOrderId(id)
	if err != nil {
		return err
	}

	data, err := json.Marshal(foodIds)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type OrderInput struct {
	AddressId        uint       `json:"address_id"`
	UserId           uint       `json:"user_id"`
	//RestaurantId     uint     `json:"restaurant_id"`
	FoodIds			 []uint   `json:"food_ids"`
}

type OrderResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateOrder(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input OrderInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	order := &model.Order{
		State:            "new",
		UserId:           input.UserId,
		AddressId:        input.AddressId,
	}

	if err := ctx.CreateOrder(order); err != nil {
		return err
	}

	for _, foodId := range input.FoodIds {
		orderFood := &model.OrderFood{
			OrderId: order.ID,
			FoodId: foodId,
		}
		if err := ctx.CreateOrderFood(orderFood); err != nil {
			return err
		}
	}

	data, err := json.Marshal(&FoodUserResponse{Id: order.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UpdateOrderInput struct {
	State            *string     `json:"state"`
	CourierId        *uint       `json:"courier_id"`
}

func (a *API) UpdateOrderById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	var input UpdateOrderInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	existingOrder, err := ctx.GetOrderById(id)
	if err != nil || existingOrder == nil {
		return err
	}

	if input.State != nil {
		existingOrder.State = *input.State
	}
	if input.CourierId != nil {
		existingOrder.CourierId = *input.CourierId
	}

	err = ctx.UpdateOrder(existingOrder)
	if err != nil {
		return err
	}

	data, err := json.Marshal(existingOrder)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) DeleteOrderById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	existingOrder, err := ctx.GetOrderById(id)
	if err != nil || existingOrder == nil {
		return err
	}
	if err := ctx.DeleteOrder(existingOrder); err != nil {
		return err
	}
	return err
}