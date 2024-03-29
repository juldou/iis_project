package model

import (
	"golang.org/x/crypto/bcrypt"
)

func GeneratePasswordHash(password []byte) ([]byte, error) {
	return bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
}

func ComparePasswordHash(hashedPassword, givenPassword []byte) bool {
	err := bcrypt.CompareHashAndPassword(hashedPassword, givenPassword)
	return err == nil
}

type User struct {
	Model

	Email          string `json:"email"`
	HashedPassword []byte
	Role           string  `json:"role"`
	Address        Address `gorm:"association_foreignkey:ID"`
	AddressId      uint    `json:"address_id"`
	Phone          string  `json:"phone"`
}

func (u *User) SetPassword(password string) error {
	hashed, err := GeneratePasswordHash([]byte(password))
	if err != nil {
		return err
	}
	u.HashedPassword = hashed
	return nil
}

func (u *User) CheckPassword(password string) bool {
	return ComparePasswordHash(u.HashedPassword, []byte(password))
}
