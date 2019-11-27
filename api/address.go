package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"github.com/iis_project/model"
	"io/ioutil"
	"net/http"
)

func (a *API) GetAddressById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	food, err := ctx.GetAddressById(id)
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

type AddressInput struct {
	Street     string `json:"street"`
	City       string `json:"city"`
	Number     string    `json:"number"`
	PostalCode string `json:"postal_code"`
}

type AddressResponse struct {
	Id uint `json:"id"`
}

func (a *API) CreateAddress(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input AddressInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	address := &model.Address{
		Street:     input.Street,
		City:       input.City,
		Number:     input.Number,
		PostalCode: input.PostalCode,
	}

	if err := ctx.CreateAddress(address); err != nil {
		return err
	}

	data, err := json.Marshal(&FoodUserResponse{Id: address.ID})
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

type UpdateAddressInput struct {
	Street     *string `json:"street"`
	City       *string `json:"city"`
	Number     *string    `json:"number"`
	PostalCode *string `json:"postal_code"`
	UserId     *uint `json:"user_id"`
}

func (a *API) UpdateAddressById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)

	var input UpdateAddressInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	existingAddress, err := ctx.GetAddressById(id)
	if err != nil || existingAddress == nil {
		return err
	}

	if input.Street != nil {
		existingAddress.Street = *input.Street
	}
	if input.City != nil {
		existingAddress.City = *input.City
	}
	if input.Number != nil {
		existingAddress.Number = *input.Number
	}
	if input.PostalCode != nil {
		existingAddress.PostalCode = *input.PostalCode
	}

	err = ctx.UpdateAddress(existingAddress)
	if err != nil {
		return err
	}

	data, err := json.Marshal(existingAddress)
	if err != nil {
		return err
	}

	_, err = w.Write(data)
	return err
}

func (a *API) DeleteAddressById(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	id := getIdFromRequest(r)
	existingAddress, err := ctx.GetAddressById(id)
	if err != nil || existingAddress == nil {
		return err
	}
	if err := ctx.DeleteAddress(existingAddress); err != nil {
		return err
	}
	return err
}
