package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetRestaurantByName(name string) (*model.Restaurant, error) {
	var restaurant model.Restaurant

	if err := db.First(&restaurant, model.Restaurant{Name: name}).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get restaurant")
	}

	return &restaurant, nil
}

func (db *Database) GetAllRestaurants() ([]*model.Restaurant, error) {
	var restaurants []*model.Restaurant
	return restaurants, errors.Wrap(db.Find(&restaurants).Error, "unable to get all restaurants")
}
