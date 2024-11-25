package services

import (
	"backend/models"
	"errors"
	"time"

	"gorm.io/gorm"
)

type FeedbackService struct {
    DB *gorm.DB
}

func NewFeedbackService(db *gorm.DB) *FeedbackService {
    return &FeedbackService{DB: db}
}
type FeedbackWithDetails struct {
    models.Feedback
    ProyectoNombre      string `json:"proyectoNombre"`
    DestinatarioNombre  string `json:"destinatarioNombre"`
    DestinatarioApellido string `json:"destinatarioApellido"`
}

type FeedbackStats struct {
    AverageScore   float64 `json:"averageScore"`
    TotalFeedbacks int     `json:"totalFeedbacks"`
    ProjectStats   []ProjectFeedbackStats `json:"projectStats"`
}

type ProjectFeedbackStats struct {
    ProjectID      uint    `json:"projectId"`
    ProjectName    string  `json:"projectName"`
    Role          string  `json:"role"`
    AverageScore   float64 `json:"averageScore"`
    FeedbackCount  int     `json:"feedbackCount"`
}

func (s *FeedbackService) CreateFeedback(feedback *models.Feedback) error {
    var proyectoUsuarioAutor models.ProyectosUsuarios
    var proyectoUsuarioDestinatario models.ProyectosUsuarios

    err := s.DB.Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL",
        feedback.IdProyecto, feedback.IdAutor).First(&proyectoUsuarioAutor).Error
    if err != nil {
        return errors.New("autor no es miembro activo del proyecto")
    }

    err = s.DB.Where("IdProyecto = ? AND IdUsuario = ? AND FechaFin IS NULL",
        feedback.IdProyecto, feedback.IdDestinatario).First(&proyectoUsuarioDestinatario).Error
    if err != nil {
        return errors.New("destinatario no es miembro activo del proyecto")
    }

    feedback.RolAutor = proyectoUsuarioAutor.IdRol
    feedback.RolDestinatario = proyectoUsuarioDestinatario.IdRol
    
    feedback.Fecha = time.Now()
    feedback.Habilitado = true
    
    return s.DB.Create(feedback).Error
}

func (s *FeedbackService) GetUserFeedbackStats(userID uint) (*FeedbackStats, error) {
    var stats FeedbackStats
    
    // Get score promedio y total de feedbacks
    err := s.DB.Model(&models.Feedback{}).
        Where("IdDestinatario = ? AND Habilitado = ?", userID, true).
        Select("COALESCE(AVG(Puntuacion), 0) as average_score, COUNT(*) as total_feedbacks").
        Row().Scan(&stats.AverageScore, &stats.TotalFeedbacks)
    
    if err != nil {
        return nil, err
    }

    // Get estadisticas especificas
    rows, err := s.DB.Raw(`
        SELECT 
            f.IdProyecto,
            p.Nombre as project_name,
            rp.Nombre as role_name,
            AVG(f.Puntuacion) as average_score,
            COUNT(*) as feedback_count
        FROM Feedback f
        JOIN Proyecto p ON f.IdProyecto = p.IdProyecto
        JOIN Rol_Proyecto rp ON f.RolDestinatario = rp.IdRol
        WHERE f.IdDestinatario = ? AND f.Habilitado = true
        GROUP BY f.IdProyecto, f.RolDestinatario
    `, userID).Rows()

    if err != nil {
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var projectStats ProjectFeedbackStats
        err := rows.Scan(
            &projectStats.ProjectID,
            &projectStats.ProjectName,
            &projectStats.Role,
            &projectStats.AverageScore,
            &projectStats.FeedbackCount,
        )
        if err != nil {
            return nil, err
        }
        stats.ProjectStats = append(stats.ProjectStats, projectStats)
    }

    return &stats, nil
}

func (s *FeedbackService) GetUserGivenFeedback(userId uint) ([]FeedbackWithDetails, error) {
    var feedbacks []FeedbackWithDetails
    err := s.DB.Raw(`
        SELECT 
            f.*,
            p.Nombre as ProyectoNombre,
            u.Nombre as DestinatarioNombre,
            u.Apellido as DestinatarioApellido
        FROM Feedback f
        JOIN Proyecto p ON f.IdProyecto = p.IdProyecto
        JOIN Usuario u ON f.IdDestinatario = u.Id
        WHERE f.IdAutor = ? AND f.Habilitado = true
        ORDER BY f.Fecha DESC
    `, userId).Scan(&feedbacks).Error
    return feedbacks, err
}

func (s *FeedbackService) GetProjectFeedback(projectID uint) ([]models.Feedback, error) {
    var feedbacks []models.Feedback
    err := s.DB.Preload("Autor").
        Preload("Destinatario").
        Where("IdProyecto = ? AND Habilitado = ?", projectID, true).
        Find(&feedbacks).Error
    return feedbacks, err
}
