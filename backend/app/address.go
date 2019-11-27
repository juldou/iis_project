package app

import (
	"github.com/iis_project/backend/model"
)

func (ctx *Context) GetAddressById(id uint) (*model.Address, error) {
	//if ctx.JwtUser == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	address, err := ctx.Database.GetAddressById(id)
	if err != nil {
		return nil, err
	}

	return address, nil
}

func (ctx *Context) GetAddressByUserId(id uint) (*model.Address, error) {
	//if ctx.JwtUser == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	user, err := ctx.Database.GetUserById(id)
	if err != nil {
		return nil, err
	}

	address, err := ctx.Database.GetAddressById(user.AddressId)
	if err != nil {
		return nil, err
	}

	return address, nil
}

func (ctx *Context) CreateAddress(address *model.Address) error {
	//if ctx.JwtUser.Role == "admin" || ctx.JwtUser.Role == "operator" {
	return ctx.Database.CreateAddress(address)
	//} else {
	//	return ctx.AuthorizationError()
	//}
}

func (ctx *Context) UpdateAddress(address *model.Address) error {
	//if ctx.JwtUser == nil {
	//	return ctx.AuthorizationError()
	//}

	return ctx.Database.UpdateAddress(address)
}

func (ctx *Context) DeleteAddress(address *model.Address) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteAddress(address)
}
