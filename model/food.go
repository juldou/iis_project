package model

type Food struct {
	Model

	Category       string     `json:"category"`
	Name           string     `json:"name"`
	Description    string     `json:"description"`
	PictureUrl     string     `json:"picture_url"`
	Restaurant     Restaurant `gorm:"association_foreignkey:ID"`
	RestaurantId   uint       `json:"restaurant_id"`
}
