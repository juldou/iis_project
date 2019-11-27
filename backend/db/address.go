package db

import (
	"github.com/iis_project/backend/model"
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

func (db *Database) CreateAddress(address *model.Address) error {
	return db.Create(address).Error
}

func (db *Database) UpdateAddress(address *model.Address) error {
	return errors.Wrap(db.Save(address).Error, "unable to update food")
}

func (db *Database) DeleteAddress(address *model.Address) error {
	return errors.Wrap(db.Delete(address).Error, "unable to delete address")
}
