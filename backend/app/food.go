package app

import (
	"github.com/iis_project/backend/model"
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

func (ctx *Context) GetAllOrdersForUser() ([]*model.Order, error) {
	if ctx.User == nil {
		return nil, ctx.AuthorizationError()
	}

	var err error
	var orders []*model.Order
	//if ctx.User.Role == "courier" {
	//	orders, err = ctx.Database.GetAllOrdersByCourierId(ctx.User.ID)
	//	if err != nil {
	//		return nil, err
	//	}
	//} else {
		orders, err = ctx.Database.GetAllOrdersByUserId(ctx.User.ID)
		if err != nil {
			return nil, err
		}
	//}
	return orders, nil
}

func (ctx *Context) GetAllOrdersAssignedToCourier() ([]*model.Order, error) {
	if ctx.User == nil {
		return nil, ctx.AuthorizationError()
	}

	if ctx.User.Role != "courier" {
		return nil, nil
	}

	orders, err := ctx.Database.GetAllOrdersByCourierId(ctx.User.ID)
	if err != nil {
		return nil, err
	}

	return orders, nil
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

func (ctx *Context) GetFoodCategories() ([]*model.FoodCategory, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	foodCategories, err := ctx.Database.GetFoodCategories()
	if err != nil {
		return nil, err
	}

	return foodCategories, nil
}

func (ctx *Context) CreateFood(food *model.Food) error {
	//if ctx.User.Role == "admin" || ctx.User.Role == "operator" {
	return ctx.Database.CreateFood(food)
	//} else {
	//	return ctx.AuthorizationError()
	//}
}

func (ctx *Context) CreateFoodCategory(foodCategory *model.FoodCategory) error {
	//if ctx.User.Role == "admin" || ctx.User.Role == "operator" {
	return ctx.Database.CreateFoodCategory(foodCategory)
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
