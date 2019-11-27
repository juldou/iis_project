package app

import (
	"github.com/iis_project/backend/model"
)

func (ctx *Context) GetMenuById(id uint) (*model.Menu, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	menu, err := ctx.Database.GetMenuById(id)
	if err != nil {
		return nil, err
	}

	return menu, nil
}

func (ctx *Context) GetMenuByRestaurantId(restaurantId uint, name string, category string) ([]model.Food, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}
	menus, err := ctx.Database.GetMenuByRestaurantId(restaurantId)
	if err != nil {
		return nil, err
	}
	var foods []model.Food
	for _, menu := range menus {
		if (name != "" && menu.Name != name) || (category != "" && menu.Food.Category != category) {
			continue
		} else {
			foods = append(foods, menu.Food)
		}
	}
	return foods, nil
}

func (ctx *Context) CreateMenu(menu *model.Menu) error {
	//if ctx.User.Role == "admin" || ctx.User.Role == "operator" {
		return ctx.Database.CreateMenu(menu)
	//} else {
	//	return ctx.AuthorizationError()
	//}
}

func (ctx *Context) UpdateMenu(menu *model.Menu) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}

	return ctx.Database.UpdateMenu(menu)
}

func (ctx *Context) DeleteMenu(menu *model.Menu) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteMenu(menu)
}
