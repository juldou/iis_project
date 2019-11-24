package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetFoodById(id uint) (*model.Food, error) {
	var food model.Food

	if err := db.First(&food, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get food by id")
	}

	return &food, nil
}

func (db *Database) GetFoods() ([]*model.Food, error) {
	var foods []*model.Food
	return foods, errors.Wrap(db.Find(&foods).Error, "unable to get foods")
}

func (db *Database) CreateFood(food *model.Food) error {
	return db.Create(food).Error
}

func (db *Database) UpdateFood(food *model.Food) error {
	return errors.Wrap(db.Save(food).Error, "unable to update food")
}

func (db *Database) DeleteFood(food *model.Food) error {
	return errors.Wrap(db.Delete(food).Error, "unable to delete food")
}