package ports

import "mime/multipart"

type FileService interface {
	UploadCSVFile(file *multipart.FileHeader) (any, error)
	GetSampleFile() (any, error)
}
