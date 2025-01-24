package handlers

func PingHandler() (map[string]string, error) {
	return map[string]string{"message": "Pong!"}, nil
}
