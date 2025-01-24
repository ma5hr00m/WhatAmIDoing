package controllers

import (
	"net/http"

	"server/internal/handlers"

	"github.com/gin-gonic/gin"
)

func UpdateStatusController(c *gin.Context) {
	err := handlers.UpdateStatusHandler(c)
	if err != nil {
		if _, ok := err.(*handlers.BadRequestError); ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Application value updated successfully."})
}

func GetStatusController(c *gin.Context) {
	resp, err := handlers.GetStatusHandler()
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
