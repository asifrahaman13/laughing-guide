package handler

import (
	"fmt"
	"net/http"

	"github.com/asifrahaman13/laughing-guide/src/core/ports"
	"github.com/gin-gonic/gin"
)

type FileHandler struct {
	fileService ports.FileService
}

func NewFileHandler(fileService ports.FileService) *FileHandler {
	return &FileHandler{fileService}
}
func (h *FileHandler) UploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")

	organizationId := c.PostForm("organizationId")
	fmt.Println(organizationId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	result, err := h.fileService.UploadCSVFile(file, organizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *FileHandler) ProcessfileHandler(c *gin.Context) {
	var Key struct {
		OrganizationId string `json:"organizationId"`
	}
	c.BindJSON(&Key)

	fmt.Println(Key.OrganizationId)
	fileprocess, err := h.fileService.ProcessFile(Key.OrganizationId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, fileprocess)
}

func (h *FileHandler) GetSampleCSVHandler(c *gin.Context) {
	key := c.Query("key")
	result, err := h.fileService.GetSampleFile(key)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
