package helper

import (
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"time"
)

var secretKey = []byte("YOUR_JWT_SECRET")

func CreateToken(username string, user_type string) (string, error) {

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username":  username,
			"exp":       time.Now().Add(time.Hour * 24).Unix(),
			"user_type": user_type,
		})

	// Sign the token
	tokenString, err := token.SignedString(secretKey)

	// Check if there is an error
	if err != nil {
		return "", err
	}

	// Return the token
	return tokenString, nil
}

func VerifyToken(tokenString string) (map[string]interface{}, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	// Validate the token
	if err != nil {
		return nil, err
	}

	// Check if the token is valid
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// Extract the claims
	claims, ok := token.Claims.(jwt.MapClaims)

	// Check if the claims are valid
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	// Return the claims
	fmt.Println("claims", claims)

	return claims, nil
}
