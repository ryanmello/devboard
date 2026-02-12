package v1

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ryanmello/devboard/db"
	"gorm.io/gorm"
)

type FollowResponse struct {
	Users []db.User `json:"users"`
	Total int64     `json:"total"`
	Page  int       `json:"page"`
	Limit int       `json:"limit"`
}

type FollowStatusResponse struct {
	IsFollowing bool `json:"isFollowing"`
}

// FollowUser godoc
// @Summary Follow a user
// @Description Follow a user by their username
// @Tags Follow
// @Accept json
// @Produce json
// @Param username path string true "Username of the user to follow"
// @Success 201 {object} db.Follow
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 409 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/{username}/follow [post]
func FollowUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	username := c.Param("username")
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

	// Cannot follow yourself
	if user.Id == userId.(string) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot follow yourself"})
		return
	}

	// Check if already following
	var existingFollow db.Follow
	err := db.GetDB().Where("follower_id = ? AND following_id = ?", userId, user.Id).First(&existingFollow).Error
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Already following this user"})
		return
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check follow status"})
		return
	}

	follow := db.Follow{
		FollowerId:  userId.(string),
		FollowingId: user.Id,
	}

	if err := db.GetDB().Create(&follow).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to follow user"})
		return
	}

	c.JSON(http.StatusCreated, follow)
}

// UnfollowUser godoc
// @Summary Unfollow a user
// @Description Unfollow a user by their username
// @Tags Follow
// @Accept json
// @Produce json
// @Param username path string true "Username of the user to unfollow"
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/{username}/follow [delete]
func UnfollowUser(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	username := c.Param("username")
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

	deleted := db.GetDB().Where("follower_id = ? AND following_id = ?", userId, user.Id).Delete(&db.Follow{})

	if deleted.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow user"})
		return
	}

	if deleted.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not following this user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User unfollowed successfully"})
}

// GetFollowers godoc
// @Summary Get followers
// @Description Returns a paginated list of users who follow the specified user
// @Tags Follow
// @Accept json
// @Produce json
// @Param username path string true "Username of the user"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Success 200 {object} FollowResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{username}/followers [get]
func GetFollowers(c *gin.Context) {
	username := c.Param("username")
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

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	var total int64
	db.GetDB().Model(&db.Follow{}).Where("following_id = ?", user.Id).Count(&total)

	var follows []db.Follow
	if err := db.GetDB().Where("following_id = ?", user.Id).Preload("Follower").
		Offset(offset).Limit(limit).Find(&follows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch followers"})
		return
	}

	users := make([]db.User, 0, len(follows))
	for _, f := range follows {
		users = append(users, f.Follower)
	}

	c.JSON(http.StatusOK, FollowResponse{
		Users: users,
		Total: total,
		Page:  page,
		Limit: limit,
	})
}

// GetFollowing godoc
// @Summary Get following
// @Description Returns a paginated list of users that the specified user follows
// @Tags Follow
// @Accept json
// @Produce json
// @Param username path string true "Username of the user"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Success 200 {object} FollowResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /users/{username}/following [get]
func GetFollowing(c *gin.Context) {
	username := c.Param("username")
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

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	var total int64
	db.GetDB().Model(&db.Follow{}).Where("follower_id = ?", user.Id).Count(&total)

	var follows []db.Follow
	if err := db.GetDB().Where("follower_id = ?", user.Id).Preload("Following").
		Offset(offset).Limit(limit).Find(&follows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch following"})
		return
	}

	users := make([]db.User, 0, len(follows))
	for _, f := range follows {
		users = append(users, f.Following)
	}

	c.JSON(http.StatusOK, FollowResponse{
		Users: users,
		Total: total,
		Page:  page,
		Limit: limit,
	})
}

// CheckFollowStatus godoc
// @Summary Check follow status
// @Description Check if the authenticated user follows a given user
// @Tags Follow
// @Accept json
// @Produce json
// @Param username path string true "Username of the user to check"
// @Success 200 {object} FollowStatusResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Security BearerAuth
// @Router /users/me/following/{username} [get]
func CheckFollowStatus(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	username := c.Param("username")
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

	var follow db.Follow
	err := db.GetDB().Where("follower_id = ? AND following_id = ?", userId, user.Id).First(&follow).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusOK, gin.H{"isFollowing": false})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch following status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isFollowing": true})
}
