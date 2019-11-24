package app

import (
	"github.com/iis_project/model"
)

func (ctx *Context) GetFoodById(id uint) (*model.Food, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	food, err := ctx.Database.GetFoodById(id)
	if err != nil {
		return nil, err
	}

	return food, nil
}

func (ctx *Context) GetFoodsByRestaurantId(id uint) ([]*model.Food, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	food, err := ctx.Database.GetFoodsByRestaurantId(id)
	if err != nil {
		return nil, err
	}

	return food, nil
}

func (ctx *Context) CreateFood(food *model.Food) error {
	//if ctx.User.Role == "admin" || ctx.User.Role == "operator" {
		return ctx.Database.CreateFood(food)
	//} else {
	//	return ctx.AuthorizationError()
	//}
}

const maxFoodNameLength = 100

func (ctx *Context) validateFood(food *model.Food) *ValidationError {
	if len(food.Name) > maxFoodNameLength {
		return &ValidationError{"name is too long"}
	}

	return nil
}

func (ctx *Context) UpdateFood(food *model.Food) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}

	// TODO: validate user for updating
	if food.Name == "" {
		return &ValidationError{"cannot update"}
	}

	if err := ctx.validateFood(food); err != nil {
		return nil
	}

	return ctx.Database.UpdateFood(food)
}

func (ctx *Context) DeleteFood(food *model.Food) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteFood(food)
}
