package model

type Menu struct {
	Model

	Name         string `json:"name"`
	Food         Food   `gorm:"association_foreignkey:ID"`
	FoodId       uint `json:"food_id"`
}
