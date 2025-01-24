package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"server/internal/handlers"
)

func PingController(c *gin.Context) {
	resp, err := handlers.PingHandler()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	c.JSON(http.StatusOK, resp)
}
