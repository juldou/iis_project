package model

type Order struct {
	Model

	State            string     `json:"state"`
	User             User       `gorm:"association_foreignkey:ID"`
	UserId           uint       `json:"user_id"`
	Courier          User       `gorm:"association_foreignkey:ID"`
	CourierId        uint       `json:"courier_id"`
	Address          Address    `gorm:"association_foreignkey:ID"`
	AddressId        uint       `json:"address_id"`
}

type OrderFood struct {
	Model

	Order   Order `gorm:"association_foreignkey:ID"`
	OrderId uint  `json:"order_id"`
	Food    Menu  `gorm:"association_foreignkey:ID"`
	FoodId  uint  `json:"food_id"`
}
