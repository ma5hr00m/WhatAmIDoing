package handlers

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	applicationValue    = "Hello"
	lastUpdateTimestamp time.Time
	appInfoMap          = map[string]map[string]string{
		"msedge": {
			"name":        "Edge",
			"description": "网上冲浪~",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
		"Code": {
			"name":        "VSCode",
			"description": "敲代码中",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
		"devenv": {
			"name":        "Visual Studio",
			"description": "敲代码中",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
		"WeChat": {
			"name":        "微信",
			"description": "聊天~",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
		"QQ": {
			"name":        "QQ",
			"description": "聊天~",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
		"*": {
			"name":        "未知",
			"description": "鼓捣些新奇玩意儿",
			"icon":        "https://img.ma5hr00m.top/2025/avatar.jpg",
		},
	}
)

type BadRequestError struct {
	Message string
}

func (e *BadRequestError) Error() string {
	return e.Message
}

func UpdateStatusHandler(c *gin.Context) error {
	var request struct {
		Application string  `json:"application"`
		Timestamp   float64 `json:"timestamp"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		return &BadRequestError{Message: "Invalid request body"}
	}

	if request.Application == "" || request.Timestamp == 0 {
		return &BadRequestError{Message: "Both application and timestamp keys are required."}
	}

	ts := time.Unix(int64(request.Timestamp), 0)
	if request.Application != applicationValue && ts.After(lastUpdateTimestamp) {
		applicationValue = request.Application
		lastUpdateTimestamp = ts
	}
	return nil
}

func GetStatusHandler() (map[string]interface{}, error) {
	currentTime := time.Now()
	var timeDifference string
	if !lastUpdateTimestamp.IsZero() {
		diff := currentTime.Sub(lastUpdateTimestamp)
		hours := int(diff.Hours())
		minutes := int(diff.Minutes()) % 60
		seconds := int(diff.Seconds()) % 60
		timeDifference = strconv.Itoa(hours) + "h " + strconv.Itoa(minutes) + "m " + strconv.Itoa(seconds) + "s"
	} else {
		timeDifference = "Never updated"
	}

	appInfo, exists := appInfoMap[applicationValue]
	if !exists {
		appInfo = appInfoMap["*"]
	}

	return map[string]interface{}{
		"application":    applicationValue,
		"lastUpdateTime": timeDifference,
		"appInfo":        appInfo,
	}, nil
}
