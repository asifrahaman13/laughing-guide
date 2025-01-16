package handler

import (
	"net/http"

	"github.com/asifrahaman13/laughing-guide/src/core/service"
	"github.com/gin-gonic/gin"
)

type FileHandler struct {
	fileService service.FileService
}

func NewFileHandler(fileService service.FileService) *FileHandler {
	return &FileHandler{fileService}
}
func (h *FileHandler) UploadHandler(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}

	result, err := h.fileService.UploadCSVFile(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}

func (h *FileHandler) GetSampleCSVHandler(c *gin.Context) {
	result, err := h.fileService.GetSampleFile()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, result)
}
