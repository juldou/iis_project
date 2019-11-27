package app

import (
	"github.com/iis_project/backend/model"
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

func (ctx *Context) GetRestaurants(category string) ([]*model.Restaurant, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	restaurants, err := ctx.Database.GetRestaurants()
	if err != nil {
		return nil, err
	}
	var filteredRestaurants []*model.Restaurant
	for _, restaurant := range restaurants {
		if category != "" && restaurant.Category != category {
			continue
		} else {
			filteredRestaurants = append(filteredRestaurants, restaurant)
		}
	}

	return filteredRestaurants, nil
}

func (ctx *Context) GetRestaurantCategories() ([]*model.RestaurantCategory, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	restaurant, err := ctx.Database.GetRestaurantCategories()
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

	if restaurant.Name == "" {
		return &ValidationError{"cannot update"}
	}

	if err := ctx.validateRestaurant(restaurant); err != nil {
		return nil
	}

	return ctx.Database.UpdateRestaurant(restaurant)
}

func (ctx *Context) DeleteRestaurant(user *model.Restaurant) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteRestaurant(user)
}
