package app

import (
	"github.com/iis_project/db"
	"github.com/iis_project/model"
	"github.com/sirupsen/logrus"
	"net/http"
)

type Context struct {
	Logger        logrus.FieldLogger
	RemoteAddress string
	Database      *db.Database
	User          *model.User
}

func (ctx *Context) WithLogger(logger logrus.FieldLogger) *Context {
	ret := *ctx
	ret.Logger = logger
	return &ret
}

func (ctx *Context) WithRemoteAddress(address string) *Context {
	ret := *ctx
	ret.RemoteAddress = address
	return &ret
}

func (ctx *Context) WithUser(user *model.User) *Context {
	ret := *ctx
	ret.User = user
	return &ret
}

func (ctx *Context) WithDatabase(database *db.Database) *Context {
	ret := *ctx
	ret.Database = database
	return &ret
}

func (ctx *Context) AuthorizationError() *UserError {
	return &UserError{Message: "unauthorized", StatusCode: http.StatusForbidden}
}
