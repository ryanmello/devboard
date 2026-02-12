package api

import (
    "crypto/ecdsa"

    "github.com/gin-gonic/gin"
    "github.com/ryanmello/devboard/middleware"
    v1 "github.com/ryanmello/devboard/api/v1"
)

func SetupRouter(publicKey *ecdsa.PublicKey) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS())

	r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

	api := r.Group("/api/v1")
	{
		public := api.Group("")
		{
            public.GET("/users", v1.GetUsers)
            public.GET("/users/:username", v1.GetUserByUsername)
            public.GET("/users/:username/github", v1.GetGitHubData)
            public.GET("/users/:username/leetcode", v1.GetLeetCodeData)
            public.GET("/users/:username/followers", v1.GetFollowers)
            public.GET("/users/:username/following", v1.GetFollowing)
        }

		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware(publicKey))
		{
            // User management
            protected.POST("/users", v1.CreateUser)
            protected.GET("/users/me", v1.GetCurrentUser)
            protected.PUT("/users/me", v1.UpdateCurrentUser)
            protected.DELETE("/users/me", v1.DeleteCurrentUser)
            
            // Skills
            protected.PUT("/users/me/skills", v1.UpdateSkills)
            
            // Projects
            protected.GET("/users/me/projects", v1.GetMyProjects)
            protected.POST("/users/me/projects", v1.CreateProject)
            protected.PUT("/users/me/projects/:id", v1.UpdateProject)
            protected.DELETE("/users/me/projects/:id", v1.DeleteProject)
            
            // Education
            protected.GET("/users/me/education", v1.GetMyEducation)
            protected.POST("/users/me/education", v1.CreateEducation)
            protected.PUT("/users/me/education/:id", v1.UpdateEducation)
            protected.DELETE("/users/me/education/:id", v1.DeleteEducation)
            
            // Experience
            protected.GET("/users/me/experience", v1.GetMyExperience)
            protected.POST("/users/me/experience", v1.CreateExperience)
            protected.PUT("/users/me/experience/:id", v1.UpdateExperience)
            protected.DELETE("/users/me/experience/:id", v1.DeleteExperience)

            // Follow
            protected.POST("/users/:username/follow", v1.FollowUser)
            protected.DELETE("/users/:username/follow", v1.UnfollowUser)
            protected.GET("/users/me/following/:username", v1.CheckFollowStatus)
        }
	}

	return r
}