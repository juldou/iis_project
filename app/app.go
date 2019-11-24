package app

import (
	//"github.com/astaxie/beego/session"
	"github.com/iis_project/db"
	"github.com/sirupsen/logrus"
	"github.com/gomodule/redigo/redis"
)

type App struct {
	Config   *Config
	Database *db.Database
	//GlobalSessions *session.Manager
	RedisCache redis.Conn
}

func (a *App) NewContext() *Context {
	return &Context{
		Logger: logrus.StandardLogger(),
	}
}

func New() (app *App, err error) {
	app = &App{}
	app.Config, err = InitConfig()
	if err != nil {
		return nil, err
	}

	dbConfig, err := db.InitConfig()
	if err != nil {
		return nil, err
	}

	app.Database, err = db.New(dbConfig)
	if err != nil {
		return nil, err
	}

	//cf := &session.ManagerConfig{
	//	CookieName:              "gosessionid",
	//	Gclifetime:              3600,
	//}
	//app.GlobalSessions, _ = session.NewManager("memory", cf)
	//go app.GlobalSessions.GC()

	// Initialize the redis connection to a redis instance running on your local machine
	conn, err := redis.DialURL("redis://localhost:6379")
	if err != nil {
		panic(err)
	}
	// Assign the connection to the package level `cache` variable
	app.RedisCache = conn

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
