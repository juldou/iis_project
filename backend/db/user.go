package db

import (
	"github.com/iis_project/backend/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetUserById(id uint) (*model.User, error) {
	var user model.User
	if err := db.First(&user, id).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get user by id")
	}
	user.Address.ID = user.AddressId
	db.First(&user.Address)
	return &user, nil
}

func (db *Database) GetUsers() ([]*model.User, error) {
	var users []*model.User
	return users, errors.Wrap(db.Find(&users).Error, "unable to get users")
}

func (db *Database) GetUserByEmail(email string) (*model.User, error) {
	var user model.User
	return &user, errors.Wrap(db.Where("email = ?", email).First(&user).Error, "unable to get user by email")
}

func (db *Database) CreateUser(user *model.User) error {
	return db.Create(user).Error
}

func (db *Database) UpdateUser(user *model.User) error {
	return errors.Wrap(db.Save(user).Error, "unable to update user")
}

func (db *Database) DeleteUser(user *model.User) error {
	return errors.Wrap(db.Delete(user).Error, "unable to delete user")
}