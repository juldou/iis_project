package model

type Restaurant struct {
	Model

	Category      string `json:"category"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	PictureUrl    string `json:"picture_url"`
	OrdersAllowed bool   `json:"orders_allowed"`
}

type RestaurantCategory struct {
	Model

	Name string `json:"name"`
}
