// services/country_service.go
package services

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "net/http"
)

type CountryService struct {}

type CountryInfo struct {
    ISOCode string `json:"isoCode"`
    Name    string `json:"name"`
}

func NewCountryService() *CountryService {
    return &CountryService{}
}

func (s *CountryService) GetCountries() ([]byte, error) {
    soapRequest := `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo">
                </ListOfCountryNamesByName>
            </soap:Body>
        </soap:Envelope>`

    // Create request
    req, err := http.NewRequest("POST", 
        "http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso", 
        bytes.NewBufferString(soapRequest))
    if err != nil {
        return nil, fmt.Errorf("error creating request: %v", err)
    }

    // Set headers
    req.Header.Set("Content-Type", "text/xml; charset=utf-8")
    req.Header.Set("SOAPAction", "http://www.oorsprong.org/websamples.countryinfo/ListOfCountryNamesByName")

    // Send request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, fmt.Errorf("error sending request: %v", err)
    }
    defer resp.Body.Close()

    // Read response
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("error reading response: %v", err)
    }

    return body, nil
}