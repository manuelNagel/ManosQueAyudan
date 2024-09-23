package main

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// Simulate a database
var users = []User{
	{ID: 1, Username: "user1", Password: "password1"},
	{ID: 2, Username: "user2", Password: "password2"},
}

func authenticateUser(username, password string) bool {
	for _, user := range users {
		if user.Username == username && user.Password == password {
			return true
		}
	}
	return false
}