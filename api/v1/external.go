package v1

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"github.com/ryanmello/devboard/services"
	"gorm.io/gorm"
)

// GetGitHubData godoc
// @Summary Get GitHub contribution data
// @Description Returns GitHub contribution calendar data for a user
// @Tags External
// @Accept json
// @Produce json
// @Param username path string true "Username"
// @Success 200 {object} services.GitHubContributionData
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{username}/github [get]
func GetGitHubData(c *gin.Context) {
	username := c.Param("username")

	// Get user from database to find their GitHub username
	var user db.User
	result := db.GetDB().Where("username = ?", username).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	// Check if user has a GitHub username
	if user.GitHubUsername == nil || *user.GitHubUsername == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "User has not connected a GitHub account"})
		return
	}

	// Fetch GitHub contribution data
	githubService := services.NewGitHubService()
	data, err := githubService.GetContributions(*user.GitHubUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

// GetLeetCodeData godoc
// @Summary Get LeetCode statistics
// @Description Returns LeetCode problem-solving statistics for a user
// @Tags External
// @Accept json
// @Produce json
// @Param username path string true "Username"
// @Success 200 {object} services.LeetCodeStats
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{username}/leetcode [get]
func GetLeetCodeData(c *gin.Context) {
	username := c.Param("username")

	// Get user from database to find their LeetCode username
	var user db.User
	result := db.GetDB().Where("username = ?", username).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	// Check if user has a LeetCode username
	if user.LeetCodeUsername == nil || *user.LeetCodeUsername == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "User has not connected a LeetCode account"})
		return
	}

	// Fetch LeetCode statistics
	leetcodeService := services.NewLeetCodeService()
	data, err := leetcodeService.GetStats(*user.LeetCodeUsername)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
