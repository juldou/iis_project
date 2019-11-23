package model

type Food struct {
	Model

	Category       string     `json:"category"`
	Name           string     `json:"name"`
	Description    string     `json:"description"`
	PictureUrl     string     `json:"picture_url"`
	FkRestaurantId uint       `json:"restaurant_id"`
}
