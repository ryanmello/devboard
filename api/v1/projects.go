package v1

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"gorm.io/gorm"
)

// CreateProjectRequest represents the request body for creating a project
type CreateProjectRequest struct {
	Name            string  `json:"name" binding:"required" example:"My Awesome Project"`
	GitHubURL       *string `json:"githubUrl" example:"https://github.com/johndoe/project"`
	PrimaryLanguage *string `json:"primaryLanguage" example:"TypeScript"`
	Description     *string `json:"description" example:"A full-stack web application"`
	Image           *string `json:"image" example:"https://example.com/project.jpg"`
	URL             *string `json:"url" example:"https://myproject.com"`
}

// UpdateProjectRequest represents the request body for updating a project
type UpdateProjectRequest struct {
	Name            *string `json:"name" example:"My Awesome Project"`
	GitHubURL       *string `json:"githubUrl" example:"https://github.com/johndoe/project"`
	PrimaryLanguage *string `json:"primaryLanguage" example:"TypeScript"`
	Description     *string `json:"description" example:"A full-stack web application"`
	Image           *string `json:"image" example:"https://example.com/project.jpg"`
	URL             *string `json:"url" example:"https://myproject.com"`
}

// GetMyProjects godoc
// @Summary Get my projects
// @Description Returns all projects for the authenticated user
// @Tags Projects
// @Accept json
// @Produce json
// @Success 200 {array} db.Project
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/projects [get]
func GetMyProjects(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var projects []db.Project
	if err := db.GetDB().Where("user_id = ?", userId).Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// CreateProject godoc
// @Summary Create project
// @Description Creates a new project for the authenticated user
// @Tags Projects
// @Accept json
// @Produce json
// @Param request body CreateProjectRequest true "Create project request"
// @Success 201 {object} db.Project
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/projects [post]
func CreateProject(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project := db.Project{
		UserId:          userId.(string),
		Name:            req.Name,
		GitHubURL:       req.GitHubURL,
		PrimaryLanguage: req.PrimaryLanguage,
		Description:     req.Description,
		Image:           req.Image,
		URL:             req.URL,
	}

	if err := db.GetDB().Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, project)
}

// UpdateProject godoc
// @Summary Update project
// @Description Updates an existing project
// @Tags Projects
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Param request body UpdateProjectRequest true "Update project request"
// @Success 200 {object} db.Project
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/projects/{id} [put]
func UpdateProject(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	projectId := c.Param("id")

	var project db.Project
	result := db.GetDB().Where("id = ? AND user_id = ?", projectId, userId).First(&project)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch project"})
		return
	}

	var req UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.GitHubURL != nil {
		updates["git_hub_url"] = *req.GitHubURL
	}
	if req.PrimaryLanguage != nil {
		updates["primary_language"] = *req.PrimaryLanguage
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Image != nil {
		updates["image"] = *req.Image
	}
	if req.URL != nil {
		updates["url"] = *req.URL
	}

	if len(updates) > 0 {
		if err := db.GetDB().Model(&project).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
			return
		}
	}

	// Fetch updated project
	db.GetDB().Where("id = ?", projectId).First(&project)
	c.JSON(http.StatusOK, project)
}

// DeleteProject godoc
// @Summary Delete project
// @Description Deletes a project
// @Tags Projects
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/projects/{id} [delete]
func DeleteProject(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	projectId := c.Param("id")

	result := db.GetDB().Where("id = ? AND user_id = ?", projectId, userId).Delete(&db.Project{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}
