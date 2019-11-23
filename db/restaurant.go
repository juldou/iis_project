package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetRestaurantById(id uint) (*model.Restaurant, error) {
	var restaurant model.Restaurant

	if err := db.First(&restaurant, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get restaurant by id")
	}

	return &restaurant, nil
}

func (db *Database) GetRestaurantByName(name string) (*model.Restaurant, error) {
	var restaurant model.Restaurant

	if err := db.First(&restaurant, model.Restaurant{Name: name}).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get restaurant by name")
	}

	return &restaurant, nil
}

func (db *Database) GetRestaurants() ([]*model.Restaurant, error) {
	var restaurants []*model.Restaurant
	return restaurants, errors.Wrap(db.Find(&restaurants).Error, "unable to get restaurants")
}

func (db *Database) GetRestaurantCategories() ([]*model.RestaurantCategory, error) {
	var restaurantCategories []*model.RestaurantCategory
	return restaurantCategories, errors.Wrap(db.Find(&restaurantCategories).Error, "unable to get restaurant categories")
}

func (db *Database) CreateRestaurant(restaurant *model.Restaurant) error {
	return db.Create(restaurant).Error
}

func (db *Database) UpdateRestaurant(restaurant *model.Restaurant) error {
	return errors.Wrap(db.Save(restaurant).Error, "unable to update restaurant")
}