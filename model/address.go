package model

type Address struct {
	Model

	Street     string `json:"street"`
	City       string `json:"city"`
	Number     string `json:"number"`
	PostalCode string `json:"postal_code"`
	User       User   `gorm:"association_foreignkey:ID"`
	UserId     uint   `json:"user_id"`
}
