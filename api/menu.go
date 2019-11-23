package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"net/http"
)

func (a *API) GetMenuByRestaurantId(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	restaurantId := getIdFromRequest(r)
	menuName := r.FormValue("name")

	foods, err := ctx.Database.GetMenuByRestaurantIdAndMenuName(restaurantId, menuName)
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
