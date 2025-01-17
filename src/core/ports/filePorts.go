package ports

import "mime/multipart"

type FileService interface {
	UploadCSVFile(file *multipart.FileHeader, organization string) (bool, error)
	GetSampleFile() (any, error)
}
