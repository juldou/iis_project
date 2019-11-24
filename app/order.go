package app

import (
	"github.com/iis_project/model"
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
