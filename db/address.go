package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetAddressById(id uint) (*model.Address, error) {
	var address model.Address

	if err := db.First(&address, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get address by id")
	}

	return &address, nil
}

func (db *Database) GetAllAddressesByUserId(id uint) ([]*model.Address, error) {
	var address []*model.Address

	if err := db.Find(&address, model.Address{UserId: id}).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get address by id")
	}

	return address, nil
}

func (db *Database) CreateAddress(food *model.Address) error {
	return db.Create(food).Error
}

func (db *Database) UpdateAddress(food *model.Address) error {
	return errors.Wrap(db.Save(food).Error, "unable to update food")
}