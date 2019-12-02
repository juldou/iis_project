package db

import (
	"github.com/iis_project/backend/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"log"
)

func (db *Database) GetMenuByRestaurantId(id uint) ([]*model.Menu, error) {
	var menus []*model.Menu
	if err := db.Joins("join food on food.id=menu.food_id").Where("food.restaurant_id=? and menu.deleted_at is null", id).Find(&menus).Error; err != nil {
		log.Fatal(err)
		return nil, err
	}
	for _, menu := range menus {
		menu.Food.ID = menu.FoodId
		db.First(&menu.Food)
		db.First(&menu.Food.Restaurant)
	}
	return menus, nil
}

func (db *Database) GetMenuById(id uint) (*model.Menu, error) {
	var menu model.Menu

	if err := db.First(&menu, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get menu by id")
	}

	return &menu, nil
}

func (db *Database) CreateMenu(menu *model.Menu) error {
	return db.Create(menu).Error
}

func (db *Database) UpdateMenu(menu *model.Menu) error {
	return errors.Wrap(db.Save(menu).Error, "unable to update menu")
}

func (db *Database) DeleteMenu(menu *model.Menu) error {
	return errors.Wrap(db.Delete(menu).Error, "unable to delete menu")
}

func (db *Database) GetMenuByFoodId(id uint) (*model.Menu, error) {
	var menu *model.Menu
	if err := db.Where("food_id=? and menu.deleted_at is null", id).Find(&menu).Error; err != nil {
		log.Fatal(err)
		return nil, err
	}
	return menu, nil
}
