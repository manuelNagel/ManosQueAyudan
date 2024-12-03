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
	"math"
	"strconv"
	"time"

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
		usuario.Password = ""
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

func (s *UsuarioService) GetUsariosbyProjectDistance(projectLat, projectLon float64, idproy int) ([]struct {
	Usuario  *models.Usuario
	Distance float64
}, error) {
	// Fetch all active, non-deleted users
	var usuarios []models.Usuario
	err := s.DB.Where("Activo = ? AND Eliminado = ?", false, false).Find(&usuarios).Error
	if err != nil {
		return nil, err
	}
	// Slice to store users within radius
	var usersInRadius []struct {
		Usuario  *models.Usuario
		Distance float64
	}

	// Calculate distance for each user
	for _, usuario := range usuarios {
		// Decrypt location if encrypted
		var lat, lon float64
		var err error
		if usuario.EncryptedLatitud != "" && usuario.EncryptedLongitud != "" {
			lat, err = s.decryptLocation(usuario.EncryptedLatitud)
			if err != nil {
				continue // Skip user if decryption fails
			}
			lon, err = s.decryptLocation(usuario.EncryptedLongitud)
			if err != nil {
				continue // Skip user if decryption fails
			}
		} else {
			lat = usuario.Latitud
			lon = usuario.Longitud
		}

		// Skip if no valid coordinates
		if lat == 0 && lon == 0 {
			continue
		}

		// Calculate distance using Haversine formula
		distance := calculateDistance(projectLat, projectLon, lat, lon)

		// Check if distance is within user's work radius
		if distance <= float64(usuario.RadioTrabajo) {
			// Create notification for user
			notificacionesService := NewNotificacionesService(s.DB)
			notificacion := &models.Notificacion{
				UsuarioNotificado: usuario.Id,
				Fecha:             time.Now(),
				Descripcion:       fmt.Sprintf("Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/%d\" >Ir al Proyecto </a>", idproy),
			}
			// fmt.Println("Hay un nuevo proyecto que podría interesarte. <a href=\"./projects/view/%d\" >Ir al Proyecto </a>", idproy)
			err = notificacionesService.AddNotificacion(notificacion)
			if err != nil {
				// Log error but continue processing other users
				fmt.Printf("Error creating notification for user %d: %v\n", usuario.Id, err)
			}

			// Add user to results
			usersInRadius = append(usersInRadius, struct {
				Usuario  *models.Usuario
				Distance float64
			}{
				Usuario:  &usuario,
				Distance: distance,
			})
		}
	}

	return usersInRadius, nil
}

// calculateDistance calculates the great-circle distance between two points
func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const earthRadius = 6371 // kilometers

	// Convert to radians
	lat1Rad := lat1 * math.Pi / 180
	lon1Rad := lon1 * math.Pi / 180
	lat2Rad := lat2 * math.Pi / 180
	lon2Rad := lon2 * math.Pi / 180

	// Haversine formula
	dlat := lat2Rad - lat1Rad
	dlon := lon2Rad - lon1Rad

	a := math.Sin(dlat/2)*math.Sin(dlat/2) +
		math.Cos(lat1Rad)*math.Cos(lat2Rad)*
			math.Sin(dlon/2)*math.Sin(dlon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return earthRadius * c
}
