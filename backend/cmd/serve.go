package cmd

import (
	"context"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/iis_project/backend/api"
	"github.com/iis_project/backend/app"
	"github.com/iis_project/backend/model"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"time"
)

func serveAPI(ctx context.Context, api *api.API) {
	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"*", "GET", "HEAD", "POST", "OPTIONS", "PATCH", "DELETE"}),
		handlers.AllowedHeaders([]string{"*", "Content-Type", "Authorization"}),
		handlers.ExposedHeaders([]string{"*"}),
	)

	router := mux.NewRouter()
	api.Init(router.PathPrefix("/api").Subrouter())

	server := &http.Server{
		Addr:        fmt.Sprintf(":%d", api.Config.Port),
		Handler:     cors(router),
		ReadTimeout: 2 * time.Minute,
	}

	done := make(chan struct{})
	go func() {
		<-ctx.Done()
		if err := server.Shutdown(context.Background()); err != nil {
			logrus.Error(err)
		}
		close(done)
	}()

	logrus.Infof("serving api at http://127.0.0.1:%d", api.Config.Port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		logrus.Error(err)
	}
	<-done
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "servers the api",
	RunE: func(cmd *cobra.Command, args []string) error {
		app, err := app.New()
		if err != nil {
			return err
		}
		defer app.Close()

		api, err := api.New(app)
		if err != nil {
			return err
		}

		ctx, cancel := context.WithCancel(context.Background())

		go func() {
			ch := make(chan os.Signal, 1)
			signal.Notify(ch, os.Interrupt)
			<-ch
			logrus.Info("signal caught. shutting down...")
			cancel()
		}()

		var wg sync.WaitGroup

		wg.Add(1)
		go func() {
			defer wg.Done()
			defer cancel()
			serveAPI(ctx, api)
		}()

		initUsers(app)

		wg.Wait()
		return nil
	},
}

func initUsers(app *app.App) {
	user := &model.User{Email: "admin@admin.com", Role: "admin", AddressId: 1, Phone: "+421949111222"}
	password := "admin"
	user.SetPassword(password)
	app.Database.CreateUser(user)

	user = &model.User{Email: "operator@operator.com", Role: "operator", AddressId: 1, Phone: "+421949111222"}
	password = "operator"
	user.SetPassword(password)
	app.Database.CreateUser(user)

	user = &model.User{Email: "courier@courier.com", Role: "courier", AddressId: 1, Phone: "+421949111222"}
	password = "courier"
	user.SetPassword(password)
	app.Database.CreateUser(user)

	user = &model.User{Email: "customer@customer.com", Role: "customer", AddressId: 1, Phone: "+421949111222"}
	password = "customer"
	user.SetPassword(password)
	app.Database.CreateUser(user)
}

func init() {
	rootCmd.AddCommand(serveCmd)
}
