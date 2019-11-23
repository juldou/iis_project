package model

type Restaurant struct {
	Model

	Category      string  `json:"category"`
	Name          string  `json:"name"`
	Description   string  `json:"description"`
	PictureUrl    string  `json:"picture_url"`
}

type RestaurantCategory struct {
	Model

	Name          string  `json:"name"`
}
