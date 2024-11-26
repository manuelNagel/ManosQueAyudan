package services

import (
	"time"

	"gorm.io/gorm"
)

type ProjectReportingService struct {
    DB *gorm.DB
}

type BasicStats struct {
    TotalProjects       int `json:"totalProjects"`
    ActiveProjects      int `json:"activeProjects"`
    CompletedProjects   int `json:"completedProjects"`
    TotalParticipations int `json:"totalParticipations"`
}

type ProjectStats struct {
    BasicStats
    ParticipationHistory []ParticipationData `json:"participationHistory"`
    RoleDistribution     []RoleData          `json:"roleDistribution"`
}


type ProjectBasicInfo struct {
    IdProyecto            uint      `json:"idProyecto"`
    Nombre                string    `json:"nombre"`
    FechaInicio           time.Time `json:"fechaInicio"`
    FechaFinalizacion     time.Time `json:"fechaFinalizacion"`
    CantidadParticipantes int       `json:"cantidadParticipantes"`
    Descripcion           string    `json:"descripcion"`
    Localizacion          string    `json:"localizacion"`
    Habilitado            bool      `json:"habilitado"`
}

type ParticipantCounts struct {
    TotalParticipants  int     `json:"totalParticipants"`
    ActiveParticipants int     `json:"activeParticipants"`
    CompletionRate     float64 `json:"completionRate"`
}

type ActivityStatus struct {
    Name   string `json:"name"`
	Status int    `json:"status"`}

type ParticipantHistoryEntry struct {
    Month  string `json:"month"`
    Joined int    `json:"joined"`
    Left   int    `json:"left"`
}

type ProjectDetailedStats struct {
    ProjectInfo        ProjectBasicInfo          `json:"projectInfo"`
    TotalParticipants  int                       `json:"totalParticipants"`
    ActiveParticipants int                       `json:"activeParticipants"`
    CompletionRate     float64                   `json:"completionRate"`
    Activities         []ActivityStatus          `json:"activities"`
    ParticipantHistory []ParticipantHistoryEntry `json:"participantHistory"`
}


type ParticipationData struct {
    Month        string `json:"month"`
    ProjectCount int    `json:"projectCount"`
    Role         string `json:"role"`
}

type RoleData struct {
    Role  string `json:"role"`
    Count int    `json:"count"`
}

func NewProjectReportingService(db *gorm.DB) *ProjectReportingService {
    return &ProjectReportingService{DB: db}
}

// metodo para las estadisticas generales del usuario
func (s *ProjectReportingService) GetUserProjectStats(userId uint) (*ProjectStats, error) {
    var stats ProjectStats
    var basicStats BasicStats

    //  estadisticas basicas
    err := s.DB.Raw(`
        SELECT 
            COUNT(DISTINCT p.IdProyecto) as total_projects,
            SUM(CASE WHEN p.Habilitado = true THEN 1 ELSE 0 END) as active_projects,
            SUM(CASE WHEN p.FechaFinalizacion < NOW() THEN 1 ELSE 0 END) as completed_projects,
            COUNT(DISTINCT pu.IdProyecto) as total_participations
        FROM Proyecto p
        JOIN Proyectos_Usuarios pu ON p.IdProyecto = pu.IdProyecto
        WHERE pu.IdUsuario = ? AND p.Eliminado = false
    `, userId).Scan(&basicStats).Error

    if err != nil {
        return nil, err
    }

    stats.BasicStats = basicStats

    // historia de participación
    var participationHistory []ParticipationData
    err = s.DB.Raw(`
        SELECT 
            DATE_FORMAT(pu.FechaInicio, '%Y-%m') as Month,
            COUNT(*) as ProjectCount,
            rp.Nombre as Role
        FROM Proyectos_Usuarios pu
        JOIN Rol_Proyecto rp ON pu.IdRol = rp.IdRol
        WHERE pu.IdUsuario = ?
        GROUP BY Month, rp.Nombre
        ORDER BY Month DESC
        LIMIT 12
    `, userId).Scan(&participationHistory).Error

    if err != nil {
        return nil, err
    }
    stats.ParticipationHistory = participationHistory

    // distribución de roles
    var roleDistribution []RoleData
    err = s.DB.Raw(`
        SELECT 
            rp.Nombre as Role,
            COUNT(*) as Count
        FROM Proyectos_Usuarios pu
        JOIN Rol_Proyecto rp ON pu.IdRol = rp.IdRol
        WHERE pu.IdUsuario = ? AND pu.FechaFin IS NULL
        GROUP BY rp.Nombre
    `, userId).Scan(&roleDistribution).Error

    if err != nil {
        return nil, err
    }
    stats.RoleDistribution = roleDistribution

    return &stats, nil
}

//metodo para conseguir los stats del proyecto
func (s *ProjectReportingService) GetProjectDetailedStats(projectId uint) (*ProjectDetailedStats, error) {
    var stats ProjectDetailedStats
    
    // info basica
    var projectInfo ProjectBasicInfo
    err := s.DB.Raw(`
        SELECT 
            IdProyecto,
            Nombre,
            FechaInicio,
            FechaFinalizacion,
            CantidadParticipantes,
            Descripcion,
            Localizacion,
            Habilitado
        FROM Proyecto
        WHERE IdProyecto = ?
    `, projectId).Scan(&projectInfo).Error
    if err != nil {
        return nil, err
    }
    stats.ProjectInfo = projectInfo

    // participantes y completion rates
    var counts ParticipantCounts
	err = s.DB.Raw(`
    SELECT 
        COUNT(DISTINCT pu.IdUsuario) as total_participants,
        COUNT(DISTINCT CASE WHEN pu.FechaFin IS NULL THEN pu.IdUsuario END) as active_participants,
        IFNULL(
            (SUM(CASE WHEN a.Estado = 2 THEN 1 ELSE 0 END) * 100.0) /
            NULLIF(COUNT(a.NumeroActividad), 0),
            0
        ) as completion_rate
    FROM Proyectos_Usuarios pu
    LEFT JOIN Actividad a ON a.ProyectoID = pu.IdProyecto
    WHERE pu.IdProyecto = ?
`, projectId).Scan(&counts).Error
    if err != nil {
        return nil, err
    }
    
    stats.TotalParticipants = counts.TotalParticipants
    stats.ActiveParticipants = counts.ActiveParticipants
    stats.CompletionRate = counts.CompletionRate

    // estado de actividades
	var activities []ActivityStatus
	err = s.DB.Raw(`
		SELECT 
			Nombre as name,
			Estado as status  
		FROM Actividad
		WHERE ProyectoID = ?
		ORDER BY NumeroActividad
	`, projectId).Scan(&activities).Error
    if err != nil {
        return nil, err
    }
    stats.Activities = activities

    // historia de participacion
    var history []ParticipantHistoryEntry
    err = s.DB.Raw(`
        SELECT 
            DATE_FORMAT(event_date, '%Y-%m') as Month,
            SUM(CASE WHEN event_type = 'joined' THEN 1 ELSE 0 END) as Joined,
            SUM(CASE WHEN event_type = 'left' THEN 1 ELSE 0 END) as 'Left'
        FROM (
            SELECT FechaInicio as event_date, 'joined' as event_type
            FROM Proyectos_Usuarios
            WHERE IdProyecto = ?
            UNION ALL
            SELECT FechaFin as event_date, 'left' as event_type
            FROM Proyectos_Usuarios
            WHERE IdProyecto = ? AND FechaFin IS NOT NULL
        ) events
        WHERE event_date IS NOT NULL
        GROUP BY Month
        ORDER BY Month DESC
        LIMIT 12
    `, projectId, projectId).Scan(&history).Error
    if err != nil {
        return nil, err
    }
    stats.ParticipantHistory = history

    return &stats, nil
}