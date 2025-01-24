package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/handlers"
)

func UpdateAppInfoMapController(c *gin.Context) {
	err := handlers.UpdateAppInfoMapHandler(c)
	if err != nil {
		var badRequestError *handlers.BadRequestError
		if errors.As(err, &badRequestError) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "appInfoMap updated successfully."})
}

func GetAppInfoMapController(c *gin.Context) {
	resp, err := handlers.GetAppInfoMapHandler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "OK",
		"code":    "1",
		"data":    resp,
	})
}
