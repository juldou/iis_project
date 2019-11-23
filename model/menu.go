package model

type Menu struct {
	Model

	Name         string `json:"name"`
	Restaurant   Restaurant
	RestaurantId string `json:"category"`
	Food         Food   `gorm:"association_foreignkey:ID"`
	FoodId       string `json:"food_id"`
}
