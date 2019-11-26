package api

import (
	"fmt"
	"github.com/spf13/viper"
)

type Config struct {
	// The port to bind the web application server to
	Port int

	// The number of proxies positioned in front of the API. This is used to interpret
	// X-Forwarded-For headers.
	ProxyCount int

	// jwt secret
	JwtSecret []byte
}

func InitConfig() (*Config, error) {
	config := &Config{
		Port:       viper.GetInt("Port"),
		ProxyCount: viper.GetInt("ProxyCount"),
		JwtSecret: []byte(viper.GetString("JwtSecret")),
	}
	if config.Port == 0 {
		config.Port = 9092
	}
	if len(config.JwtSecret) == 0 {
		return nil, fmt.Errorf("JwtSecret must be set!")
	}
	return config, nil
}
