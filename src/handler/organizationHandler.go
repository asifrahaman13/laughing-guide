package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/asifrahaman13/laughing-guide/src/config"
	"github.com/asifrahaman13/laughing-guide/src/core/domain"
	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/asifrahaman13/laughing-guide/src/helper"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

type OrganizationHandler struct {
	service ports.OrganizationService
}

func NewOrganizationHandler(service ports.OrganizationService) *OrganizationHandler {
	return &OrganizationHandler{service}
}

func (h *OrganizationHandler) CalculatePayrollHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	fmt.Println(organizationEmail)
	result, err := h.service.CalculatePayroll(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *OrganizationHandler) FetchPayrollHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	result, err := h.service.AllPayroll(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *OrganizationHandler) FetchPayrollHandlerc(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	result, err := h.service.AllPayroll(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return

	}
	c.JSON(http.StatusOK, result)
}

func (h *OrganizationHandler) NotifyPayrollHandler(c *gin.Context) {
	organizationId := c.Query("organizationId")
	organizationEmail, exists := c.Get("email")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	err := h.service.NotifyPayroll(organizationId, organizationEmail.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, "Payroll has been notified")
}

func (h *OrganizationHandler) GoogleAuthHandler(c *gin.Context) {
	token := c.Query("token")
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
	accessToken, err := helper.GenerateJWT("access", claims)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}
	refreshClaims := jwt.MapClaims{
		"email": email,
		"name":  userName,
		"exp":   time.Now().Add(240 * time.Hour).Unix(),
	}
	refreshToken, err := helper.GenerateJWT("refresh", refreshClaims)
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

func (h *OrganizationHandler) GetOrganizationsHandler(c *gin.Context) {

	token := c.Query("token")

	claims, err := helper.ValidateJWT(token)
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

func (h *OrganizationHandler) AddOrganizationHandler(c *gin.Context) {
	var request domain.OrganizationRequest
	authorizationToken := c.GetHeader("Authorization")
	if authorizationToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	token := authorizationToken[7:]
	claims, err := helper.ValidateJWT(token)

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

func (h *OrganizationHandler) DeleteOrganizationHandler(c *gin.Context) {
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
	claims, err := helper.ValidateJWT(token)
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

func (h *OrganizationHandler) ValidateTokenHandler(c *gin.Context) {
	token := c.Query("token")
	fmt.Println(token)
	claims, err := helper.ValidateJWT(token)
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

func (h *OrganizationHandler) GetSingleOrganizationHandler(c *gin.Context) {
	token := c.Query("token")
	claims, err := helper.ValidateJWT(token)
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
