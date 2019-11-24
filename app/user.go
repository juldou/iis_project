package app

import (
	"strings"

	"github.com/pkg/errors"

	"github.com/iis_project/model"
)

func (ctx *Context) GetUserById(id uint) (*model.User, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	user, err := ctx.Database.GetUserById(id)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (ctx *Context) GetUsers() ([]*model.User, error) {
	//if ctx.User == nil {
	//	return nil, ctx.AuthorizationError()
	//}

	user, err := ctx.Database.GetUsers()
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (ctx *Context) CreateUser(user *model.User, password string) error {
	if err := ctx.validateUser(user, password); err != nil {
		return err
	}

	if err := user.SetPassword(password); err != nil {
		return errors.Wrap(err, "unable to set user password")
	}

	return ctx.Database.CreateUser(user)
}

func (ctx *Context) validateUser(user *model.User, password string) *ValidationError {
	// naive email validation
	if !strings.Contains(user.Email, "@") {
		return &ValidationError{"invalid email"}
	}

	if password == "" {
		return &ValidationError{"password is required"}
	}

	return nil
}

func (ctx *Context) UpdateUser(user *model.User) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}

	// TODO: validate user for updating
	if !strings.Contains(user.Email, "@") {
		return &ValidationError{"invalid email"}
	}

	return ctx.Database.UpdateUser(user)
}

func (ctx *Context) DeleteUser(user *model.User) error {
	//if ctx.User == nil {
	//	return ctx.AuthorizationError()
	//}
	return ctx.Database.DeleteUser(user)
}
