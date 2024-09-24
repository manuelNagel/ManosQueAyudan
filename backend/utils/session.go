package utils

import (
	"github.com/gorilla/sessions"
)

var (
	key = []byte("super-secret-key")
	store = sessions.NewCookieStore(key)
)

func GetStore() *sessions.CookieStore {
	return store
}