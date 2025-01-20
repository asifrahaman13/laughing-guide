package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/config"
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type EmployeeHandler struct {
	service ports.EmployeeService
}

func NewEmployeeHandler(service ports.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{service}
}

func (h *EmployeeHandler) CalculatePayrollHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	result, err := h.service.CalculatePayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	result, err := h.service.AllPayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeesHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	result, err := h.service.AllEmployees(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetEmployeeStatisticsHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	result, err := h.service.EmployeeStatistics(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FilterEmployees(c *gin.Context) {
	organizationId := c.Query("organizationId")
	employeeName := c.Query("employee_name")
	employeeStatus := c.Query("employee_status")
	employeeRole := c.Query("employee_role")
	fmt.Println(employeeName, employeeStatus, employeeRole)
	result, err := h.service.FilterEmployees(employeeName, employeeStatus, employeeRole, organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) FetchPayrollHandlerc(c *gin.Context) {
	organizationId := c.Query("organizationId")
	result, err := h.service.AllPayroll(organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return

	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) UpdateEmployeeHandler(c *gin.Context) {
	var request domain.Employee
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("-------------------",request)
	result, err := h.service.UpdateEmployees(request, request.OrganizationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) DeleteEmployeeHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	var request domain.EmployeeRequest
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.service.DeleteEmployees(request.EmployeeIds, organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GoogleAuthHandler(c *gin.Context) {
	token := c.Query("token")
	fmt.Println("Google Auth Handler...........", token)
	fmt.Println(token)
	fmt.Println("token is printed.....")

	payload, err := idtoken.Validate(c.Request.Context(), token, config.LoadGoogleConfig().ClientID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(payload.Claims)

	email := payload.Claims["email"].(string)
	userName := payload.Claims["name"].(string)
	claims := jwt.MapClaims{
		"email": email,
		"name":  userName,
		"exp":   time.Now().Add(1500 * time.Minute).Unix(),
	}
	accessToken, err := generateJWT("access", claims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}
	refreshClaims := jwt.MapClaims{
		"email": email,
		"name":  userName,
		"exp":   time.Now().Add(240 * time.Hour).Unix(),
	}
	refreshToken, err := generateJWT("refresh", refreshClaims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	_, err = h.service.CreateOrganization(email, "MyOrg")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

func generateJWT(tokenType string, claims jwt.MapClaims) (string, error) {
	fmt.Println(tokenType)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("YOUR_JWT_SECRET"))
}

func (h *EmployeeHandler) ValidateTokenHandler(c *gin.Context) {
	token := c.Query("token")
	fmt.Println(token)
	claims, err := validateJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	email, ok := claims["email"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}
	userName, ok := claims["name"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"email": email, "name": userName})
}

func validateJWT(token string) (jwt.MapClaims, error) {
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte("YOUR_JWT_SECRET"), nil
	})

	fmt.Println(parsedToken)

	if err != nil {
		return nil, err
	}

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok && parsedToken.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}

func (h *EmployeeHandler) GetSingleOrganizationHandler(c *gin.Context) {
	token := c.Query("token")
	claims, err := validateJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	organizationEmail, ok := claims["email"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	result, err := h.service.GetSingleOrganization(organizationEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) GetOrganizationsHandler(c *gin.Context) {

	token := c.Query("token")

	claims, err := validateJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	organizationEmail, ok := claims["email"].(string)

	fmt.Println(organizationEmail)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}
	result, err := h.service.GetOrganizations(organizationEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) AddOrganizationHandler(c *gin.Context) {
	var request domain.OrganizationRequest
	authorizationToken := c.GetHeader("Authorization")
	if authorizationToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	token := authorizationToken[7:]
	claims, err := validateJWT(token)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	organizationEmail, ok := claims["email"].(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}
	err = c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := h.service.CreateOrganization(organizationEmail, request.OrganizationName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *EmployeeHandler) DeleteOrganizationHandler(c *gin.Context) {
	var request domain.OrganizationRequest
	authorizationToken := c.GetHeader("Authorization")
	if authorizationToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return

	}

	token := authorizationToken[7:]
	claims, err := validateJWT(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	organizationEmail, ok := claims["email"].(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	result, err := h.service.DeleteOrganization(request.OrganizationID, organizationEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
