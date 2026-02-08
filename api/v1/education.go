package v1

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"gorm.io/gorm"
)

// CreateEducationRequest represents the request body for creating education
type CreateEducationRequest struct {
	UniversityName  string  `json:"universityName" binding:"required" example:"Stanford University"`
	UniversityImage *string `json:"universityImage" example:"https://example.com/stanford.jpg"`
	StartYear       string  `json:"startYear" binding:"required" example:"2018"`
	GraduationYear  string  `json:"graduationYear" binding:"required" example:"2022"`
	Major           string  `json:"major" binding:"required" example:"Computer Science"`
	Minor           *string `json:"minor" example:"Mathematics"`
	GPA             *string `json:"gpa" example:"3.8"`
}

// UpdateEducationRequest represents the request body for updating education
type UpdateEducationRequest struct {
	UniversityName  *string `json:"universityName" example:"Stanford University"`
	UniversityImage *string `json:"universityImage" example:"https://example.com/stanford.jpg"`
	StartYear       *string `json:"startYear" example:"2018"`
	GraduationYear  *string `json:"graduationYear" example:"2022"`
	Major           *string `json:"major" example:"Computer Science"`
	Minor           *string `json:"minor" example:"Mathematics"`
	GPA             *string `json:"gpa" example:"3.8"`
}

// GetMyEducation godoc
// @Summary Get my education
// @Description Returns all education entries for the authenticated user
// @Tags Education
// @Accept json
// @Produce json
// @Success 200 {array} db.Education
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/education [get]
func GetMyEducation(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var education []db.Education
	if err := db.GetDB().Where("user_id = ?", userId).Find(&education).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch education"})
		return
	}

	c.JSON(http.StatusOK, education)
}

// CreateEducation godoc
// @Summary Create education
// @Description Creates a new education entry for the authenticated user
// @Tags Education
// @Accept json
// @Produce json
// @Param request body CreateEducationRequest true "Create education request"
// @Success 201 {object} db.Education
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/education [post]
func CreateEducation(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req CreateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	education := db.Education{
		UserId:          userId.(string),
		UniversityName:  req.UniversityName,
		UniversityImage: req.UniversityImage,
		StartYear:       req.StartYear,
		GraduationYear:  req.GraduationYear,
		Major:           req.Major,
		Minor:           req.Minor,
		GPA:             req.GPA,
	}

	if err := db.GetDB().Create(&education).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create education"})
		return
	}

	c.JSON(http.StatusCreated, education)
}

// UpdateEducation godoc
// @Summary Update education
// @Description Updates an existing education entry
// @Tags Education
// @Accept json
// @Produce json
// @Param id path string true "Education ID"
// @Param request body UpdateEducationRequest true "Update education request"
// @Success 200 {object} db.Education
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/education/{id} [put]
func UpdateEducation(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	educationId := c.Param("id")

	var education db.Education
	result := db.GetDB().Where("id = ? AND user_id = ?", educationId, userId).First(&education)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Education not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch education"})
		return
	}

	var req UpdateEducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if req.UniversityName != nil {
		updates["university_name"] = *req.UniversityName
	}
	if req.UniversityImage != nil {
		updates["university_image"] = *req.UniversityImage
	}
	if req.StartYear != nil {
		updates["start_year"] = *req.StartYear
	}
	if req.GraduationYear != nil {
		updates["graduation_year"] = *req.GraduationYear
	}
	if req.Major != nil {
		updates["major"] = *req.Major
	}
	if req.Minor != nil {
		updates["minor"] = *req.Minor
	}
	if req.GPA != nil {
		updates["gpa"] = *req.GPA
	}

	if len(updates) > 0 {
		if err := db.GetDB().Model(&education).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update education"})
			return
		}
	}

	// Fetch updated education
	db.GetDB().Where("id = ?", educationId).First(&education)
	c.JSON(http.StatusOK, education)
}

// DeleteEducation godoc
// @Summary Delete education
// @Description Deletes an education entry
// @Tags Education
// @Accept json
// @Produce json
// @Param id path string true "Education ID"
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/education/{id} [delete]
func DeleteEducation(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	educationId := c.Param("id")

	result := db.GetDB().Where("id = ? AND user_id = ?", educationId, userId).Delete(&db.Education{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete education"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Education not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Education deleted successfully"})
}
