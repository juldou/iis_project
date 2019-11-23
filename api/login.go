package api

import (
	"encoding/json"
	"fmt"
	"github.com/iis_project/app"
	"io/ioutil"
	"net/http"
)

type LoginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (a *API) LoginHandler(ctx *app.Context, w http.ResponseWriter, r *http.Request) error {
	var input LoginInput

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, &input); err != nil {
		return err
	}

	user, err := a.App.GetUserByEmail(input.Username)

	if user == nil || err != nil {
		if err != nil {
			ctx.Logger.WithError(err).Error("unable to get user")
		}
		http.Error(w, "invalid credentials", http.StatusForbidden)
	}

	if ok := user.CheckPassword(input.Password); !ok {
		http.Error(w, "invalid credentials", http.StatusForbidden)
	}

	sess, err := a.App.GlobalSessions.SessionStart(w, r)
	defer sess.SessionRelease(w)
	username := sess.Get(input.Username)
	fmt.Println(username)

	return err
}
