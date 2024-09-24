package services

import (
	"errors"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UsuarioService struct {
	DB *gorm.DB
}

func NewUsuarioService(db *gorm.DB) *UsuarioService {
	return &UsuarioService{DB: db}
}

func (s *UsuarioService) GetUsuario(id int) (*models.Usuario, error) {
	var usuario models.Usuario
	result := s.DB.First(&usuario, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("usuario not found")
		}
		return nil, result.Error
	}
	return &usuario, nil
}

func (s *UsuarioService) GetUsuarioByEmail(email string) (*models.Usuario, error) {
	var usuario models.Usuario
	result := s.DB.Where("email = ?", email).First(&usuario)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("usuario not found")
		}
		return nil, result.Error
	}
	return &usuario, nil
}

func (s *UsuarioService) CreateUsuario(usuario *models.Usuario) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usuario.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	usuario.Password = string(hashedPassword)
	
	result := s.DB.Create(usuario)
	return result.Error
}

func (s *UsuarioService) UpdateUsuario(usuario *models.Usuario) error {
	result := s.DB.Save(usuario)
	return result.Error
}

func (s *UsuarioService) DeleteUsuario(id int) error {
	result := s.DB.Delete(&models.Usuario{}, id)
	return result.Error
}

func (s *UsuarioService) AuthenticateUser(email, password string) (*models.Usuario, error) {
	var usuario models.Usuario
	result := s.DB.Where("email = ?", email).First(&usuario)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("usuario not found")
		}
		return nil, result.Error
	}

	err := bcrypt.CompareHashAndPassword([]byte(usuario.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &usuario, nil
}