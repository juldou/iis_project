package db

import (
	"github.com/iis_project/model"
	"github.com/pkg/errors"
)

func (db *Database) GetMenuByRestaurantIdAndMenuName(id uint, name string) ([]*model.Food, error) {
	restaurant, err := db.GetRestaurantById(id)
	if err != nil {
		return nil, err
	}
	var menus []*model.Menu
	var foods []*model.Food
	db.Model(&restaurant).Related(&menus)
	for _, menu := range menus {
		if menu.Name == name {
			db.Model(&menu).Related(&menu.Food)
			foods = append(foods, &menu.Food)
		}
	}
	return foods, nil
}

func (db *Database) CreateMenu(menu *model.Menu) error {
	return db.Create(menu).Error
}

func (db *Database) UpdateMenu(menu *model.Menu) error {
	return errors.Wrap(db.Save(menu).Error, "unable to update menu")
}