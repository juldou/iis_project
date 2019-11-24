package api

import (
	"encoding/json"
	"github.com/iis_project/app"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"
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
		http.Error(w, "cannot read body data", http.StatusBadRequest)
	}

	if err := json.Unmarshal(body, &input); err != nil {
		http.Error(w, "cannot unmarshal login data", http.StatusBadRequest)
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

	cookie := &http.Cookie{
		Name:     "gosessionid",
		Value:    url.QueryEscape(sess.SessionID()),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Domain:   "random",
	}
	cookie.MaxAge = 3600
	cookie.Expires = time.Now().Add(time.Duration(3600) * time.Second)
	http.SetCookie(w, cookie)
	r.AddCookie(cookie)
	r.Header.Set("gosessionid", sess.SessionID())
	w.Header().Set("gosessionid", sess.SessionID())

	err = ctx.Database.UpdateUserSid(input.Username, sess.SessionID())

	user, err = a.App.GetUserByEmail(input.Username)
	if user == nil || err != nil {
		if err != nil {
			ctx.Logger.WithError(err).Error("unable to get user")
		}
		return err
	}

	data, err := json.Marshal(user)
	if err != nil {
		return err
	}
	_, err = w.Write(data)

	return err
}
