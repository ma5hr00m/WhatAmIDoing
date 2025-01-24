package handlers

import (
	"github.com/gin-gonic/gin"
)

func UpdateAppInfoMapHandler(c *gin.Context) error {
	var newAppInfoMap map[string]map[string]string
	if err := c.ShouldBindJSON(&newAppInfoMap); err != nil {
		return &BadRequestError{Message: "Invalid request body"}
	}

	for key, value := range newAppInfoMap {
		if key == "" {
			return &BadRequestError{Message: "Invalid format: Keys must be non-empty strings."}
		}
		if value["name"] == "" || value["description"] == "" || value["icon"] == "" {
			return &BadRequestError{Message: "Invalid format: Each value must be an object with non-empty name, description, and icon."}
		}
	}
	appInfoMap = newAppInfoMap
	return nil
}

func GetAppInfoMapHandler() (map[string]map[string]string, error) {
	return appInfoMap, nil
}
