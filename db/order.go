package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"log"
)

func (db *Database) GetOrderById(id uint) (*model.Order, error) {
	var order model.Order
	if err := db.First(&order, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get order by id")
	}
	return &order, nil
}

func (db *Database) GetAllFoodsByOrderId(orderId uint) ([]*model.OrderFood, error) {
	var orderFoods []*model.OrderFood
	if err := db.Where("order_id = ?", orderId).Find(&orderFoods).Error; err != nil {
		log.Fatal(err)
	}
	for _, orderFood := range orderFoods {
		orderFood.Menu.ID = orderFood.FoodId
		db.First(&orderFood.Menu)
		db.First(&orderFood.Menu.Food)
	}
	return orderFoods, nil
}

func (db *Database) CreateOrder(order *model.Order) error {
	return db.Create(order).Error
}

func (db *Database) UpdateOrder(order *model.Order) error {
	return errors.Wrap(db.Save(order).Error, "unable to update order")
}

func (db *Database) CreateOrderFood(orderFood *model.OrderFood) error {
	return db.Create(orderFood).Error
}

func (db *Database) DeleteOrder(order *model.Order) error {
	return errors.Wrap(db.Delete(order).Error, "unable to delete order")
}

func (db *Database) DeleteOrderFood(orderFood *model.OrderFood) error {
	return errors.Wrap(db.Delete(orderFood).Error, "unable to delete orderFood")
}
