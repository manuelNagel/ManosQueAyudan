package services

import (
	"backend/models"
	"errors"
	"fmt"
	"log"
	"time"

	"gorm.io/gorm"
)

type ProjectParticipant struct {
    IdUsuario    uint      `json:"idUsuario"`
    Nombre       string    `json:"nombre"`
    Apellido     string    `json:"apellido"`
    Email        string    `json:"email"`
    RolID        uint      `json:"rolId"`
    RolNombre    string    `json:"rolNombre"`
    FechaInicio  time.Time `json:"fechaInicio"`
}

const (
    RolAdmin       = 1
    RolParticipante = 2
)

type ProyectoService struct {
	DB *gorm.DB
}

func NewProyectoService(db *gorm.DB) *ProyectoService {
	return &ProyectoService{DB: db}
}

func (s *ProyectoService) CreateProyecto(proyecto *models.Proyecto, userID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(proyecto).Error; err != nil {
            return fmt.Errorf("error creating project: %v", err)
        }

        adminRelation := models.ProyectosUsuarios{
            IdProyecto:  proyecto.IdProyecto,
            IdUsuario:   userID,
            IdRol:       RolAdmin,
            FechaInicio: time.Now(),
        }

        if err := tx.Create(&adminRelation).Error; err != nil {
            return fmt.Errorf("error assigning admin role: %v", err)
        }

        return nil
    })
}

func (s *ProyectoService) TransferAdminRole(proyectoID, currentAdminID, newAdminID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        now := time.Now()

        var currentAdmin models.ProyectosUsuarios
        err := tx.Where(
            "IdProyecto = ? AND IdUsuario = ? AND IdRol = ? AND FechaFin IS NULL",
            proyectoID, currentAdminID, RolAdmin,
        ).First(&currentAdmin).Error
        if err != nil {
            return fmt.Errorf("usuario actual no es administrador del proyecto")
        }

        currentAdmin.FechaFin = &now
        if err := tx.Save(&currentAdmin).Error; err != nil {
            return fmt.Errorf("error al finalizar rol actual: %v", err)
        }

        if err := tx.Model(&models.ProyectosUsuarios{}).
            Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", proyectoID, newAdminID).
            Update("FechaFin", now).Error; err != nil {
            return fmt.Errorf("error al actualizar roles existentes: %v", err)
        }

        newAdminRole := models.ProyectosUsuarios{
            IdProyecto:  proyectoID,
            IdUsuario:   newAdminID,
            IdRol:       RolAdmin,
            FechaInicio: now,
        }

        if err := tx.Create(&newAdminRole).Error; err != nil {
            return fmt.Errorf("error al asignar nuevo administrador: %v", err)
        }

        return nil
    })
}


func (s *ProyectoService) GetProyecto(id uint) (*models.Proyecto, error) {
    log.Printf("GetProyecto called with ID: %d", id)
    var proyecto models.Proyecto
    if err := s.DB.Preload("Actividades").First(&proyecto, id).Error; err != nil {
        log.Printf("Error in GetProyecto: %v", err)
        return nil, err
    }
    return &proyecto, nil
}

func (s *ProyectoService) GetCurrentProjectAdmin(proyectoID uint) (*models.Usuario, error) {
    var proyectoUsuario models.ProyectosUsuarios
    err := s.DB.Preload("Usuario").
        Where("IdProyecto = ? AND IdRol = ? AND FechaFin IS NULL", proyectoID, RolAdmin).
        First(&proyectoUsuario).Error
    if err != nil {
        return nil, fmt.Errorf("no se encontró administrador activo: %v", err)
    }
    return &proyectoUsuario.Usuario, nil
}

func (s *ProyectoService) ListJoinedProjects(userId uint) ([]models.Proyecto, error) {
    log.Printf("Fetching joined projects for user ID: %d", userId)
    
    var proyectos []models.Proyecto

    // Explicitly specify the query to avoid auto-preloading
    query := `
        SELECT DISTINCT p.* 
        FROM Proyecto p
        INNER JOIN Proyectos_Usuarios pu ON p.IdProyecto = pu.IdProyecto
        WHERE pu.IdUsuario = ?
        AND pu.FechaFin IS NULL 
        AND p.Eliminado = false`

    if err := s.DB.Raw(query, userId).Scan(&proyectos).Error; err != nil {
        log.Printf("Error in main query: %v", err)
        return nil, fmt.Errorf("error fetching projects: %v", err)
    }

    if len(proyectos) == 0 {
        log.Printf("No projects found for user %d", userId)
        return []models.Proyecto{}, nil
    }

    var projectIDs []uint
    for _, p := range proyectos {
        projectIDs = append(projectIDs, p.IdProyecto)
    }

    var activities []models.Actividad
    if err := s.DB.Where("ProyectoID IN ?", projectIDs).Find(&activities).Error; err != nil {
        log.Printf("Error fetching activities: %v", err)
        return nil, fmt.Errorf("error fetching activities: %v", err)
    }

    activityMap := make(map[uint][]models.Actividad)
    for _, activity := range activities {
        activityMap[activity.ProyectoID] = append(activityMap[activity.ProyectoID], activity)
    }

    for i := range proyectos {
        proyectos[i].Actividades = activityMap[proyectos[i].IdProyecto]
    }

    log.Printf("Successfully fetched %d projects with their activities", len(proyectos))
    return proyectos, nil
}

func (s *ProyectoService) GetUserProjectRole(userId uint, projectId uint) (*models.RolProyecto, error) {
    var proyectoUsuario models.ProyectosUsuarios

    err := s.DB.Debug().
        Preload("Rol").
        Where("IdUsuario = ? AND IdProyecto = ? AND FechaFin IS NULL", 
            userId, projectId).
        First(&proyectoUsuario).Error

    if err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, nil
        }
        return nil, fmt.Errorf("error getting user role: %v", err)
    }

    return &proyectoUsuario.Rol, nil
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
    return s.DB.Model(&models.Proyecto{}).Where("IdProyecto = ?", id).Update("Eliminado", true).Error
}

func (s *ProyectoService) JoinProject(proyectoID, usuarioID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
      
        var proyecto models.Proyecto
        if err := tx.Where("IdProyecto = ? AND Habilitado = ? AND Eliminado = ?", proyectoID, true,false).First(&proyecto).Error; err != nil {
            return fmt.Errorf("proyecto no encontrado o no habilitado")
        }

        var existing models.ProyectosUsuarios
        err := tx.Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", proyectoID, usuarioID).First(&existing).Error
        if err == nil {
            return fmt.Errorf("usuario ya está participando en este proyecto")
        }

        proyectoUsuario := models.ProyectosUsuarios{
            IdProyecto:  proyectoID,
            IdUsuario:   usuarioID,
            IdRol:       RolParticipante, 
            FechaInicio: time.Now(),
        }

        if err := tx.Create(&proyectoUsuario).Error; err != nil {
            return fmt.Errorf("error al unir al proyecto: %v", err)
        }

        return nil
    })
}

func (s *ProyectoService) LeaveProject(proyectoID, usuarioID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        var proyectoUsuario models.ProyectosUsuarios
        if err := tx.Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", 
            proyectoID, usuarioID).First(&proyectoUsuario).Error; err != nil {
            return fmt.Errorf("usuario no está participando en este proyecto")
        }

        now := time.Now()
        proyectoUsuario.FechaFin = &now

        return tx.Save(&proyectoUsuario).Error
    })
}


func (s *ProyectoService) IsUserInProject(proyectoID, usuarioID uint) (bool, error) {
    var count int64
    err := s.DB.Model(&models.ProyectosUsuarios{}).
        Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", proyectoID, usuarioID).
        Count(&count).Error
    return count > 0, err
}

func (s *ProyectoService) ListProyectos() ([]models.Proyecto, error) {
    var proyectos []models.Proyecto
    err := s.DB.Where("Eliminado = ?", false).Find(&proyectos).Error
    if err != nil {
        return nil, err
    }

    for i := range proyectos {
        if err := s.DB.Model(&proyectos[i]).Association("Actividades").Find(&proyectos[i].Actividades); err != nil {
            return nil, err
        }
    }

    return proyectos, nil
}

func (s *ProyectoService) ListUserProjects(userId uint) ([]models.Proyecto, error) {
    var proyectos []models.Proyecto
    
    err := s.DB.Distinct("p.*").
        Table("Proyecto p").
        Joins("JOIN Proyectos_Usuarios pu ON p.IdProyecto = pu.IdProyecto").
        Where("pu.IdUsuario = ? AND pu.IdRol = ? AND p.Eliminado = ? AND pu.FechaFin IS NULL", 
            userId, RolAdmin, false).
        Preload("Actividades").
        Find(&proyectos).Error

    if err != nil {
        return nil, fmt.Errorf("error fetching user projects: %v", err)
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

func (s *ProyectoService) GetUserProjectRoles(proyectoID, usuarioID uint) ([]models.ProyectosUsuarios, error) {
    var roles []models.ProyectosUsuarios
    err := s.DB.Preload("Rol").
        Where("IdProyecto = ? AND IdUsuario = ?", proyectoID, usuarioID).
        Order("FechaInicio DESC").
        Find(&roles).Error
    return roles, err
}

// Method to check if user is project admin
func (s *ProyectoService) IsProjectAdmin(proyectoID, usuarioID uint) (bool, error) {
    var count int64
    err := s.DB.Model(&models.ProyectosUsuarios{}).
        Where("IdProyecto = ? AND IdUsuario = ? AND IdRol = ? AND FechaFin IS NULL",
            proyectoID, usuarioID, RolAdmin).
        Count(&count).Error
    return count > 0, err
}

func (s *ProyectoService) RemoveParticipant(proyectoID, adminID, participantID uint) error {
    return s.DB.Transaction(func(tx *gorm.DB) error {
        // Verify admin status
        var adminRole models.ProyectosUsuarios
        err := tx.Where("IdProyecto = ? AND IdUsuario = ? AND IdRol = ? AND FechaFin IS NULL",
            proyectoID, adminID, RolAdmin).First(&adminRole).Error
        if err != nil {
            return fmt.Errorf("no tienes permisos de administrador para este proyecto")
        }

        // Prevent self-removal as admin
        if adminID == participantID {
            return fmt.Errorf("no puedes removerte a ti mismo como administrador")
        }

        // Set FechaFin to current time for the participant
        now := time.Now()
        result := tx.Model(&models.ProyectosUsuarios{}).
            Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", 
                proyectoID, participantID).
            Update("FechaFin", now)

        if result.Error != nil {
            return fmt.Errorf("error al remover participante: %v", result.Error)
        }

        if result.RowsAffected == 0 {
            return fmt.Errorf("participante no encontrado o ya removido")
        }

        return nil
    })
}

// Get detailed participant information
func (s *ProyectoService) GetProjectParticipants(proyectoID uint) ([]ProjectParticipant, error) {
    var participants []ProjectParticipant

    query := `
        SELECT 
            u.Id as IdUsuario,
            u.Nombre,
            u.Apellido,
            u.Email,
            r.IdRol as RolID,
            r.Nombre as RolNombre,
            pu.FechaInicio
        FROM Proyectos_Usuarios pu
        JOIN Usuario u ON pu.IdUsuario = u.Id
        JOIN Rol_proyecto r ON pu.IdRol = r.IdRol
        WHERE pu.IdProyecto = ? 
        AND pu.FechaFin IS NULL
        AND u.Eliminado = false
        ORDER BY pu.FechaInicio DESC`

    if err := s.DB.Raw(query, proyectoID).Scan(&participants).Error; err != nil {
        return nil, fmt.Errorf("error getting participants: %v", err)
    }

    return participants, nil
}

// Magía de la haversine formula para la busqueda de proyectos


/*
*Metodo que busca los proyectos por la localización y radio del usuario
*/
func (s *ProyectoService) SearchProyectosByLocation(lat, lon float64, radiusKm float64, userId uint) ([]struct {
    models.Proyecto
    Distance float64 `json:"distance"`
    IsMember bool   `json:"isMember"`
}, error) {
    var results []struct {
        models.Proyecto
        Distance float64 `json:"distance"`
        IsMember bool   `json:"isMember"`
    }

    query := `
        WITH ProjectDistances AS (
            SELECT p.*,
            (
                111.111 * DEGREES(
                    ACOS(
                        LEAST(1.0, 
                            COS(RADIANS(?)) * 
                            COS(RADIANS(p.Latitud)) * 
                            COS(RADIANS(?) - RADIANS(p.Longitud)) + 
                            SIN(RADIANS(?)) * 
                            SIN(RADIANS(p.Latitud))
                        )
                    )
                )
            ) as calculated_distance
            FROM Proyecto p
            WHERE 
                p.Eliminado = false
                AND p.Habilitado = true
                AND p.Latitud BETWEEN ? - (?/111.111) AND ? + (?/111.111)
                AND p.Longitud BETWEEN ? - (?/(111.111 * COS(RADIANS(?)))) AND ? + (?/(111.111 * COS(RADIANS(?))))
            HAVING calculated_distance <= ?
        )
        SELECT pd.*, 
               CASE WHEN pu.IdUsuario IS NOT NULL THEN true ELSE false END as IsMember,
               pd.calculated_distance as Distance
        FROM ProjectDistances pd
        LEFT JOIN Proyectos_Usuarios pu ON pd.IdProyecto = pu.IdProyecto 
            AND pu.IdUsuario = ? 
            AND pu.FechaFin IS NULL
        ORDER BY pd.calculated_distance`

    err := s.DB.Raw(
        query,
        lat, lon, lat,
        lat, radiusKm, lat, radiusKm,
        lon, radiusKm, lat, lon, radiusKm, lat,
        radiusKm,
        userId,
    ).Scan(&results).Error

    if err != nil {
        return nil, fmt.Errorf("error searching projects: %v", err)
    }

    return results, nil
}

func (s *ProyectoService) GetProjectWithMembershipStatus(id uint, userId uint) (*models.Proyecto, bool, error) {
    var proyecto models.Proyecto
    if err := s.DB.Preload("Actividades").First(&proyecto, id).Error; err != nil {
        return nil, false, err
    }

    var count int64
    err := s.DB.Model(&models.ProyectosUsuarios{}).
        Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL", id, userId).
        Count(&count).Error
    if err != nil {
        return nil, false, err
    }

    return &proyecto, count > 0, nil
}

func (s *ProyectoService) GetProyectoWithDistance(id uint, userLat, userLon float64) (*models.Proyecto, float64, error) {
    var proyecto models.Proyecto
    var result struct {
        models.Proyecto
        CalculatedDistance float64 `gorm:"column:calculated_distance"`
    }

    query := `
        SELECT p.*,
        (
            111.111 * DEGREES(
                ACOS(
                    LEAST(1.0, 
                        COS(RADIANS(?)) * 
                        COS(RADIANS(p.Latitud)) * 
                        COS(RADIANS(?) - RADIANS(p.Longitud)) + 
                        SIN(RADIANS(?)) * 
                        SIN(RADIANS(p.Latitud))
                    )
                )
            )
        ) as calculated_distance
        FROM Proyecto p
        WHERE p.IdProyecto = ? 
        AND p.Eliminado = false`

    err := s.DB.Raw(query, userLat, userLon, userLat, id).Scan(&result).Error
    if err != nil {
        return nil, 0, fmt.Errorf("error getting project with distance: %v", err)
    }

    proyecto = result.Proyecto
    
    if err := s.DB.Preload("Actividades").
        Where("IdProyecto = ? AND Eliminado = ?", id, false).
        First(&proyecto).Error; err != nil {
        return nil, 0, fmt.Errorf("error loading project details: %v", err)
    }

    return &proyecto, result.CalculatedDistance, nil
}