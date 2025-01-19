package ports

import "mime/multipart"

type FileService interface {
	UploadCSVFile(file *multipart.FileHeader, organization string) (bool, error)
	GetSampleFile(key string) (any, error)
	ProcessFile(key string) (bool, error)
}
