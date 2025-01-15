package helper

import "math"

func TruncateToTwoDecimals(value float64) float64 {
    return math.Trunc(value*100) / 100
}