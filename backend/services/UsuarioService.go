package services

import (
	"backend/models"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strconv"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UsuarioService struct {
	DB            *gorm.DB
	encryptionKey []byte
}

func NewUsuarioService(db *gorm.DB, encryptionKey []byte) *UsuarioService {
	return &UsuarioService{
		DB:            db,
		encryptionKey: encryptionKey,
	}
}

func (s *UsuarioService) DeleteUsuario(id uint) error {
    return s.DB.Model(&models.Usuario{}).Where("Id = ?", id).Update("Eliminado", true).Error
}

func (s *UsuarioService) encrypt(text string) (string, error) {
	block, err := aes.NewCipher(s.encryptionKey)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := gcm.Seal(nonce, nonce, []byte(text), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func (s *UsuarioService) decrypt(encryptedText string) (string, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(encryptedText)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(s.encryptionKey)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	if len(ciphertext) < gcm.NonceSize() {
		return "", errors.New("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:gcm.NonceSize()], ciphertext[gcm.NonceSize():]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

func (s *UsuarioService) encryptLocation(value float64) (string, error) {
	return s.encrypt(fmt.Sprintf("%.10f", value))
}

func (s *UsuarioService) decryptLocation(encrypted string) (float64, error) {
	decrypted, err := s.decrypt(encrypted)
	if err != nil {
		return 0, err
	}
	return strconv.ParseFloat(decrypted, 64)
}

func (s *UsuarioService) CreateUsuario(usuario *models.Usuario) error {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usuario.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	usuario.Password = string(hashedPassword)

	return s.DB.Create(usuario).Error
}

func (s *UsuarioService) UpdateUsuario(usuario *models.Usuario) error {
	updates := map[string]interface{}{
		"Nombre":       usuario.Nombre,
		"Apellido":     usuario.Apellido,
		"Email":        usuario.Email,
		"RadioTrabajo": usuario.RadioTrabajo,
		"Pais":         usuario.Pais,
	}

	if usuario.Latitud != 0 || usuario.Longitud != 0 {
		encLat, err := s.encryptLocation(usuario.Latitud)
		if err != nil {
			return err
		}
		encLong, err := s.encryptLocation(usuario.Longitud)
		if err != nil {
			return err
		}
		encLoc, err := s.encrypt(usuario.Localizacion)
		if err != nil {
			return err
		}

		updates["EncryptedLatitud"] = encLat
		updates["EncryptedLongitud"] = encLong
		updates["EncryptedLocalizacion"] = encLoc
	}

	return s.DB.Model(usuario).Updates(updates).Error
}

func (s *UsuarioService) GetUsuario(id uint) (*models.Usuario, error) {
    var usuario models.Usuario
    if err := s.DB.Where("Id = ? AND Eliminado = ?", id, false).First(&usuario).Error; err != nil {
        return nil, err
    }

    if usuario.EncryptedLatitud != "" && usuario.EncryptedLongitud != "" {
        lat, err := s.decryptLocation(usuario.EncryptedLatitud)
        if err != nil {
            return nil, err
        }
        long, err := s.decryptLocation(usuario.EncryptedLongitud)
        if err != nil {
            return nil, err
        }
        loc, err := s.decrypt(usuario.EncryptedLocalizacion)
        if err != nil {
            return nil, err
        }

        usuario.Latitud = lat
        usuario.Longitud = long
        usuario.Localizacion = loc
		usuario.Password=""
    }

    return &usuario, nil
}

// Authentication method remains unchanged, using bcrypt
func (s *UsuarioService) AuthenticateUser(email, password string) (*models.Usuario, error) {
	var usuario models.Usuario
	if err := s.DB.Where("email = ?", email).First(&usuario).Error; err != nil {
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(usuario.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return &usuario, nil
}

func (s *UsuarioService) GetUserByEmail(email string) (*models.Usuario, error) {
	var user models.Usuario
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Retorna nil si no se encuentra el usuario
		}
		return nil, err // Retorna el error si ocurrió un problema en la consulta
	}
	return &user, nil
}

func (s *UsuarioService) UpdatePassword(email string, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Actualizar solo el campo de la contraseña
	return s.DB.Model(&models.Usuario{}).Where("email = ?", email).Update("password", hashedPassword).Error
}
