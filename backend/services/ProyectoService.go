package services

import (
	"backend/models"
	"errors"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type ProyectoService struct {
	DB *gorm.DB
}

func NewProyectoService(db *gorm.DB) *ProyectoService {
	return &ProyectoService{DB: db}
}

func (s *ProyectoService) CreateProyecto(proyecto *models.Proyecto) error {
	return s.DB.Create(proyecto).Error
}

func (s *ProyectoService) GetProyecto(id uint) (*models.Proyecto, error) {
	var proyecto models.Proyecto
	if err := s.DB.Preload("Actividades").First(&proyecto, id).Error; err != nil {
		return nil, err
	}
	return &proyecto, nil
}

func (s *ProyectoService) UpdateProyecto(proyecto *models.Proyecto) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        if err := tx.Save(proyecto).Error; err != nil {
            return err
        }

        // Handle Actividades
        var existingActividades []models.Actividad
        if err := tx.Where("ProyectoID = ?", proyecto.IdProyecto).Find(&existingActividades).Error; err != nil {
            return err
        }

        // Create a map of existing Actividades for easy lookup
        existingMap := make(map[int]models.Actividad)
        for _, act := range existingActividades {
            existingMap[act.NumeroActividad] = act
        }

        // Update or create Actividades
        for _, act := range proyecto.Actividades {
            if _, exists := existingMap[act.NumeroActividad]; exists {
                // Update existing Actividad
                if err := tx.Save(&act).Error; err != nil {
                    return err
                }
            } else {
                // Create new Actividad
                act.ProyectoID = proyecto.IdProyecto
                if err := tx.Create(&act).Error; err != nil {
                    return err
                }
            }
            delete(existingMap, act.NumeroActividad)
        }

        // Delete Actividades that no longer exist in the updated project
        for _, act := range existingMap {
            if err := tx.Delete(&act).Error; err != nil {
                return err
            }
        }

        return nil
    })
}

func (s *ProyectoService) DeleteProyecto(id uint) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
        if err := tx.Where("ProyectoID = ?", id).Delete(&models.Actividad{}).Error; err != nil {
            return err
        }

        if err := tx.Delete(&models.Proyecto{}, id).Error; err != nil {
            return err
        }

        return nil
    })
}

func (s *ProyectoService) ListProyectos() ([]models.Proyecto, error) {
    var proyectos []models.Proyecto
    err := s.DB.Find(&proyectos).Error
    if err != nil {
        return nil, err
    }

    for i := range proyectos {
        if err := s.DB.Model(&proyectos[i]).Association("Actividades").Find(&proyectos[i].Actividades); err != nil {
            log.Printf("Error al buscar las actividades %d: %v", proyectos[i].IdProyecto, err)
        }
    }

    return proyectos, nil
}

func (s *ProyectoService) UpdateActividad(proyectoID uint, actividad models.Actividad) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        var proyecto models.Proyecto
        if err := tx.First(&proyecto, proyectoID).Error; err != nil {
            return err
        }

        if actividad.ProyectoID != proyectoID {
            return errors.New("Actividad no pertenece a este Proyecto")
        }

        if err := tx.Save(&actividad).Error; err != nil {
            return err
        }

        return nil
    })
}

func (s *ProyectoService) DeleteActividad(proyectoID uint, actividadID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        var actividad models.Actividad
        if err := tx.Where("ProyectoID = ? AND NumeroActividad = ?", proyectoID, actividadID).First(&actividad).Error; err != nil {
            return err
        }

        if err := tx.Delete(&actividad).Error; err != nil {
            return err
        }

        return nil
    })
}

// Magía de la haversine formula para la busqueda de proyectos


/*
*Metodo que busca los proyectos por la localización y radio del usuario
*/
func (s *ProyectoService) SearchProyectosByLocation(lat, lon float64, radiusKm float64) ([]models.Proyecto, error) {
    var proyectos []models.Proyecto
    
    // MySQL Haversine formula optimizada
    query := `
        SELECT *,
        (
            111.111 *
            DEGREES(ACOS(
                LEAST(1.0, COS(RADIANS(?)) * COS(RADIANS(Latitud)) * 
                COS(RADIANS(?) - RADIANS(Longitud)) +
                SIN(RADIANS(?)) * SIN(RADIANS(Latitud)))
            )
        ) AS distance
        FROM Proyecto
        WHERE 
            Latitud BETWEEN ? - (?/111.111) AND ? + (?/111.111) AND
            Longitud BETWEEN ? - (?/(111.111 * COS(RADIANS(?)))) AND ? + (?/(111.111 * COS(RADIANS(?)))) AND
            Habilitado = true
        HAVING distance <= ?
        ORDER BY distance;`

    //  Calcula la "caja" de limites para el filtrado inicial
    // Esto hace la query mas eficiente al eliminar desaciertos obvios
    err := s.DB.Raw(
        query,
        lat, lon, lat,
        lat, radiusKm, lat, radiusKm,
        lon, radiusKm, lat, lon, radiusKm, lat,
        radiusKm,
    ).Scan(&proyectos).Error

    if err != nil {
        return nil, fmt.Errorf("error searching projects: %v", err)
    }

    // Load related data
    for i := range proyectos {
        if err := s.DB.Preload("Actividades").First(&proyectos[i], proyectos[i].IdProyecto).Error; err != nil {
            return nil, fmt.Errorf("error loading project details: %v", err)
        }
    }

    return proyectos, nil
}

func (s *ProyectoService) GetProyectoWithDistance(id uint, userLat, userLon float64) (*models.Proyecto, float64, error) {
    var proyecto models.Proyecto
    var distance float64

    query := `
        SELECT *,
        (
            111.111 *
            DEGREES(ACOS(
                LEAST(1.0, COS(RADIANS(?)) * COS(RADIANS(Latitud)) * 
                COS(RADIANS(?) - RADIANS(Longitud)) +
                SIN(RADIANS(?)) * SIN(RADIANS(Latitud)))
            )
        ) AS distance
        FROM Proyecto
        WHERE IdProyecto = ?`

    err := s.DB.Raw(query, userLat, userLon, userLat, id).Scan(&proyecto).Error
    if err != nil {
        return nil, 0, err
    }

    // Conside la distancia calculada de la query
    err = s.DB.Raw("SELECT @distance AS distance").Scan(&distance).Error
    if err != nil {
        distance = 0 
    }

    // carga data relacionada
    if err := s.DB.Preload("Actividades").First(&proyecto, id).Error; err != nil {
        return nil, 0, err
    }

    return &proyecto, distance, nil
}