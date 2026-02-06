package v1

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"gorm.io/gorm"
)

// CreateExperienceRequest represents the request body for creating experience
type CreateExperienceRequest struct {
	Company        string  `json:"company" binding:"required" example:"Google"`
	CompanyImage   *string `json:"companyImage" example:"https://example.com/google.jpg"`
	Title          string  `json:"title" binding:"required" example:"Software Engineer"`
	StartMonth     string  `json:"startMonth" binding:"required" example:"January"`
	StartYear      string  `json:"startYear" binding:"required" example:"2022"`
	EndMonth       *string `json:"endMonth" example:"December"`
	EndYear        *string `json:"endYear" example:"2023"`
	IsCurrent      *bool   `json:"isCurrent" example:"false"`
	Location       *string `json:"location" example:"Mountain View, CA"`
	EmploymentType *string `json:"employmentType" example:"Full-time"`
	Description    *string `json:"description" example:"Developed scalable microservices..."`
}

// UpdateExperienceRequest represents the request body for updating experience
type UpdateExperienceRequest struct {
	Company        *string `json:"company" example:"Google"`
	CompanyImage   *string `json:"companyImage" example:"https://example.com/google.jpg"`
	Title          *string `json:"title" example:"Software Engineer"`
	StartMonth     *string `json:"startMonth" example:"January"`
	StartYear      *string `json:"startYear" example:"2022"`
	EndMonth       *string `json:"endMonth" example:"December"`
	EndYear        *string `json:"endYear" example:"2023"`
	IsCurrent      *bool   `json:"isCurrent" example:"false"`
	Location       *string `json:"location" example:"Mountain View, CA"`
	EmploymentType *string `json:"employmentType" example:"Full-time"`
	Description    *string `json:"description" example:"Developed scalable microservices..."`
}

// GetMyExperience godoc
// @Summary Get my experience
// @Description Returns all experience entries for the authenticated user
// @Tags Experience
// @Accept json
// @Produce json
// @Success 200 {array} db.Experience
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/experience [get]
func GetMyExperience(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var experience []db.Experience
	if err := db.GetDB().Where("user_id = ?", userId).Find(&experience).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch experience"})
		return
	}

	c.JSON(http.StatusOK, experience)
}

// CreateExperience godoc
// @Summary Create experience
// @Description Creates a new experience entry for the authenticated user
// @Tags Experience
// @Accept json
// @Produce json
// @Param request body CreateExperienceRequest true "Create experience request"
// @Success 201 {object} db.Experience
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/experience [post]
func CreateExperience(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req CreateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isCurrent := false
	if req.IsCurrent != nil {
		isCurrent = *req.IsCurrent
	}

	experience := db.Experience{
		UserId:         userId.(string),
		Company:        req.Company,
		CompanyImage:   req.CompanyImage,
		Title:          req.Title,
		StartMonth:     req.StartMonth,
		StartYear:      req.StartYear,
		EndMonth:       req.EndMonth,
		EndYear:        req.EndYear,
		IsCurrent:      isCurrent,
		Location:       req.Location,
		EmploymentType: req.EmploymentType,
		Description:    req.Description,
	}

	if err := db.GetDB().Create(&experience).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create experience"})
		return
	}

	c.JSON(http.StatusCreated, experience)
}

// UpdateExperience godoc
// @Summary Update experience
// @Description Updates an existing experience entry
// @Tags Experience
// @Accept json
// @Produce json
// @Param id path string true "Experience ID"
// @Param request body UpdateExperienceRequest true "Update experience request"
// @Success 200 {object} db.Experience
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/experience/{id} [put]
func UpdateExperience(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	experienceId := c.Param("id")

	var experience db.Experience
	result := db.GetDB().Where("id = ? AND user_id = ?", experienceId, userId).First(&experience)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Experience not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch experience"})
		return
	}

	var req UpdateExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if req.Company != nil {
		updates["company"] = *req.Company
	}
	if req.CompanyImage != nil {
		updates["company_image"] = *req.CompanyImage
	}
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.StartMonth != nil {
		updates["start_month"] = *req.StartMonth
	}
	if req.StartYear != nil {
		updates["start_year"] = *req.StartYear
	}
	if req.EndMonth != nil {
		updates["end_month"] = *req.EndMonth
	}
	if req.EndYear != nil {
		updates["end_year"] = *req.EndYear
	}
	if req.IsCurrent != nil {
		updates["is_current"] = *req.IsCurrent
	}
	if req.Location != nil {
		updates["location"] = *req.Location
	}
	if req.EmploymentType != nil {
		updates["employment_type"] = *req.EmploymentType
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}

	if len(updates) > 0 {
		if err := db.GetDB().Model(&experience).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update experience"})
			return
		}
	}

	// Fetch updated experience
	db.GetDB().Where("id = ?", experienceId).First(&experience)
	c.JSON(http.StatusOK, experience)
}

// DeleteExperience godoc
// @Summary Delete experience
// @Description Deletes an experience entry
// @Tags Experience
// @Accept json
// @Produce json
// @Param id path string true "Experience ID"
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/experience/{id} [delete]
func DeleteExperience(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	experienceId := c.Param("id")

	result := db.GetDB().Where("id = ? AND user_id = ?", experienceId, userId).Delete(&db.Experience{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete experience"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Experience not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Experience deleted successfully"})
}
