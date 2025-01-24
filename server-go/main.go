package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"net/http"
	"server/internal/config"
	"server/internal/middlewares"
	"server/internal/router"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load config")
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())
	r.Use(middlewares.LoggerMiddleware())

	router.SetupRoutes(r)

	srv := &http.Server{
		Addr:    cfg.Server.Port,
		Handler: r,
	}

	log.Info().Msgf("Server is running on http://localhost%s", cfg.Server.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal().Err(err).Msg("Failed to start server")
	}
}
