package model

type Menu struct {
	Model

	Name         string `json:"name"`
	Restaurant   Restaurant
	RestaurantId uint `json:"restaurant_id"`
	Food         Food   `gorm:"association_foreignkey:ID"`
	FoodId       uint `json:"food_id"`
}
