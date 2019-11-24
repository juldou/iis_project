package db

import (
	"github.com/iis_project/model"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

func (db *Database) GetUserByEmail(email string) (*model.User, error) {
	var user model.User

	if err := db.First(&user, model.User{Email: email}).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get user by email")
	}

	return &user, nil
}

func (db *Database) GetUserBySid(sid string) (*model.User, error) {
	var user model.User

	if err := db.First(&user, model.User{Sid: sid}).Error; err != nil {
		if gorm.IsRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, errors.Wrap(err, "unable to get user by sid")
	}

	return &user, nil
}

func (db *Database) UpdateUserSid(email string, sid string) error {
	user, err := db.GetUserByEmail(email)
	if err != nil {
		return err
	}
	return errors.Wrap(db.Model(&user).Update("sid", sid).Error, "unable to update user sid")
}

func (db *Database) CreateUser(user *model.User) error {
	return db.Create(user).Error
}
