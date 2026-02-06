package v1

import (
	"errors"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"gorm.io/gorm"
)

// CreateUserRequest represents the request body for creating a user
type CreateUserRequest struct {
	Username string `json:"username" binding:"required" example:"johndoe"`
	Email    string `json:"email" binding:"required,email" example:"john@example.com"`
}

// UpdateUserRequest represents the request body for updating a user
type UpdateUserRequest struct {
	FirstName        *string `json:"firstName" example:"John"`
	LastName         *string `json:"lastName" example:"Doe"`
	Headline         *string `json:"headline" example:"Full Stack Developer"`
	Image            *string `json:"image" example:"https://example.com/image.jpg"`
	Resume           *string `json:"resume" example:"https://example.com/resume.pdf"`
	GitHubUsername   *string `json:"githubUsername" example:"johndoe"`
	LeetCodeUsername *string `json:"leetcodeUsername" example:"johndoe"`
	LinkedInUsername *string `json:"linkedinUsername" example:"johndoe"`
}

// UpdateSkillsRequest represents the request body for updating skills
type UpdateSkillsRequest struct {
	Skills []string `json:"skills" binding:"required" example:"Go,TypeScript,React"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error" example:"Something went wrong"`
}

// MessageResponse represents a success message response
type MessageResponse struct {
	Message string `json:"message" example:"Operation successful"`
}

// GetUserByUsername godoc
// @Summary Get user by username
// @Description Returns a user's public profile by username with projects, education, and experience
// @Tags Users
// @Accept json
// @Produce json
// @Param username path string true "Username"
// @Success 200 {object} db.User
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{username} [get]
func GetUserByUsername(c *gin.Context) {
	username := c.Param("username")

	var user db.User
	result := db.GetDB().Preload("Projects").Preload("Education").Preload("Experience").
		Where("username = ?", username).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// CreateUser godoc
// @Summary Create user profile
// @Description Creates a new user profile for the authenticated user
// @Tags Users
// @Accept json
// @Produce json
// @Param request body CreateUserRequest true "Create user request"
// @Success 201 {object} db.User
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 409 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users [post]
func CreateUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate username
	if err := validateUsername(req.Username); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if username is already taken
	var existingUser db.User
	if err := db.GetDB().Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username is already taken"})
		return
	}

	// Check if user already has a profile
	if err := db.GetDB().Where("id = ?", userId).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User profile already exists"})
		return
	}

	user := db.User{
		Id:       userId.(string),
		Email:    req.Email,
		Username: req.Username,
		Role:     "user",
		Skills:   []string{},
	}

	if err := db.GetDB().Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// GetCurrentUser godoc
// @Summary Get current user
// @Description Returns the authenticated user's profile with projects, education, and experience
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {object} db.User
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me [get]
func GetCurrentUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var user db.User
	result := db.GetDB().Preload("Projects").Preload("Education").Preload("Experience").
		Where("id = ?", userId).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateCurrentUser godoc
// @Summary Update current user
// @Description Updates the authenticated user's profile
// @Tags Users
// @Accept json
// @Produce json
// @Param request body UpdateUserRequest true "Update user request"
// @Success 200 {object} db.User
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me [put]
func UpdateCurrentUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user db.User
	if err := db.GetDB().Where("id = ?", userId).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if req.FirstName != nil {
		updates["first_name"] = *req.FirstName
	}
	if req.LastName != nil {
		updates["last_name"] = *req.LastName
	}
	if req.Headline != nil {
		updates["headline"] = *req.Headline
	}
	if req.Image != nil {
		updates["image"] = *req.Image
	}
	if req.Resume != nil {
		updates["resume"] = *req.Resume
	}
	if req.GitHubUsername != nil {
		updates["git_hub_username"] = *req.GitHubUsername
	}
	if req.LeetCodeUsername != nil {
		updates["leet_code_username"] = *req.LeetCodeUsername
	}
	if req.LinkedInUsername != nil {
		updates["linked_in_username"] = *req.LinkedInUsername
	}

	if len(updates) > 0 {
		if err := db.GetDB().Model(&user).Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
			return
		}
	}

	// Fetch updated user
	db.GetDB().Where("id = ?", userId).First(&user)
	c.JSON(http.StatusOK, user)
}

// DeleteCurrentUser godoc
// @Summary Delete current user
// @Description Deletes the authenticated user's account and all associated data
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me [delete]
func DeleteCurrentUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	result := db.GetDB().Where("id = ?", userId).Delete(&db.User{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// UpdateSkills godoc
// @Summary Update user skills
// @Description Updates the authenticated user's skills array
// @Tags Users
// @Accept json
// @Produce json
// @Param request body UpdateSkillsRequest true "Update skills request"
// @Success 200 {object} db.User
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/skills [put]
func UpdateSkills(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req UpdateSkillsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user db.User
	if err := db.GetDB().Where("id = ?", userId).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Skills = req.Skills
	if err := db.GetDB().Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update skills"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// validateUsername checks if a username is valid
func validateUsername(username string) error {
	// Reserved username
	if strings.ToLower(username) == "me" {
		return errors.New("username 'me' is reserved")
	}

	// Length validation
	if len(username) < 3 || len(username) > 39 {
		return errors.New("username must be 3-39 characters")
	}

	// Format validation: alphanumeric and hyphens, cannot start/end with hyphen
	validUsername := regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$`)
	if len(username) >= 2 && !validUsername.MatchString(username) {
		return errors.New("username can only contain letters, numbers, and hyphens")
	}

	return nil
}
