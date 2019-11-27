package app

import (
	"github.com/iis_project/backend/db"
	"github.com/sirupsen/logrus"
)

type App struct {
	Database *db.Database
}

func (a *App) NewContext() *Context {
	return &Context{
		Logger: logrus.StandardLogger(),
	}
}

func New() (app *App, err error) {
	app = &App{}

	dbConfig, err := db.InitConfig()
	if err != nil {
		return nil, err
	}

	app.Database, err = db.New(dbConfig)
	if err != nil {
		return nil, err
	}

	return app, err
}

func (a *App) Close() error {
	return a.Database.Close()
}

type ValidationError struct {
	Message string `json:"message"`
}

func (e *ValidationError) Error() string {
	return e.Message
}

type UserError struct {
	Message    string `json:"message"`
	StatusCode int    `json:"-"`
}

func (e *UserError) Error() string {
	return e.Message
}
