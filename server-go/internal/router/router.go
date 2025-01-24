package router

import (
	"github.com/gin-gonic/gin"
	"server/internal/controllers"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/ping", controllers.PingController)

	statusGroup := r.Group("/status")
	{
		statusGroup.POST("/update", controllers.UpdateStatusController)
		statusGroup.GET("/", controllers.GetStatusController)
	}

	settingsGroup := r.Group("/settings")
	{
		settingsGroup.POST("/appinfomap/update", controllers.UpdateAppInfoMapController)
		settingsGroup.GET("/appinfomap/get", controllers.GetAppInfoMapController)
	}
}
