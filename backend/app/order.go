package app

import (
	"github.com/iis_project/backend/model"
)

func (ctx *Context) GetOrderById(id uint) (*model.Order, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	order, err := ctx.Database.GetOrderById(id)
	if err != nil {
		return nil, err
	}

	return order, nil
}

func (ctx *Context) GetOrders(state string) ([]*model.Order, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	orders, err := ctx.Database.GetOrders()
	if err != nil {
		return nil, err
	}
	var filteredOrders []*model.Order
	for _, order := range orders {
		if state != "" && order.State != state {
			continue
		} else {
			filteredOrders = append(filteredOrders, order)
		}
	}

	return filteredOrders, nil
}

func (ctx *Context) GetAllFoodsByOrderId(id uint) ([]model.Food, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	orderFoods, err := ctx.Database.GetAllFoodsByOrderId(id)
	if err != nil {
		return nil, err
	}
	var foods []model.Food
	for _, orderFood := range orderFoods {
		foods = append(foods, orderFood.Food)
	}

	return foods, nil
}

func (ctx *Context) CreateOrder(order *model.Order) error {
	return ctx.Database.CreateOrder(order)
}

func (ctx *Context) UpdateOrder(order *model.Order) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.UpdateOrder(order)
}

func (ctx *Context) CreateOrderFood(orderFood *model.OrderFood) error {
	return ctx.Database.CreateOrderFood(orderFood)
}

func (ctx *Context) DeleteOrder(order *model.Order) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteOrder(order)
}
