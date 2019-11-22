package api

import (
	"encoding/json"
	"net/http"
	"github.com/iis_project/app"
)

func (a *API) GetRestaurants(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	restaurants, err := ctx.Database.GetAllRestaurants()
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
