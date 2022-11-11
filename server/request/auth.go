package request

type LoginRegister struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
