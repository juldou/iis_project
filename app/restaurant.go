package app

import "github.com/iis_project/model"

func (ctx *Context) GetRestaurantByName(name string) (*model.Restaurant, error) {
	if ctx.User == nil {
		return nil, ctx.AuthorizationError()
	}

	restaurant, err := ctx.Database.GetRestaurantByName(name)
	if err != nil {
		return nil, err
	}

	return restaurant, nil
}
