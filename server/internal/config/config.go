package config

import (
	"os"

	"github.com/pelletier/go-toml/v2"
	"github.com/rs/zerolog/log"
)

type Config struct {
	Server struct {
		Port string `toml:"port"`
	} `toml:"server"`
}

func LoadConfig() (*Config, error) {
	file, err := os.ReadFile("config.toml")
	if err != nil {
		log.Error().Err(err).Msg("Failed to read config file")
		return nil, err
	}

	var cfg Config
	err = toml.Unmarshal(file, &cfg)
	if err != nil {
		log.Error().Err(err).Msg("Failed to unmarshal config file")
		return nil, err
	}

	return &cfg, nil
}
