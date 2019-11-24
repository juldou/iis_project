package app

import (
	"github.com/iis_project/model"
)

func (ctx *Context) GetRestaurantById(id uint) (*model.Restaurant, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	restaurant, err := ctx.Database.GetRestaurantById(id)
	if err != nil {
		return nil, err
	}

	return restaurant, nil
}

func (ctx *Context) GetRestaurantByName(name string) (*model.Restaurant, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	restaurant, err := ctx.Database.GetRestaurantByName(name)
	if err != nil {
		return nil, err
	}

	return restaurant, nil
}

func (ctx *Context) CreateRestaurant(restaurant *model.Restaurant) error {
	//if ctx.User.Role == "admin" || ctx.User.Role == "operator" {
		return ctx.Database.CreateRestaurant(restaurant)
	//} else {
	//	return ctx.AuthorizationError()
	//}
}

const maxRestaurantNameLength = 100

func (ctx *Context) validateRestaurant(restaurant *model.Restaurant) *ValidationError {
	if len(restaurant.Name) > maxRestaurantNameLength {
		return &ValidationError{"name is too long"}
	}

	return nil
}

func (ctx *Context) UpdateRestaurant(restaurant *model.Restaurant) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}

	// TODO: validate user for updating
	if restaurant.Name == "" {
		return &ValidationError{"cannot update"}
	}

	if err := ctx.validateRestaurant(restaurant); err != nil {
		return nil
	}

	return ctx.Database.UpdateRestaurant(restaurant)
}
