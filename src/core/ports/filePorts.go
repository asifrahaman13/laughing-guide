package ports

import "mime/multipart"

type FileService interface {
	UploadCSVFile(file *multipart.FileHeader, organization string) (bool, error)
	GetSampleFile(key string) (map[string]string, error)
	ProcessFile(key string) (bool, error)
}
