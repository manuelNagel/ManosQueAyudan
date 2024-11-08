# ManosQueAyudan
Repositorio de el proyecto tp final "Manos que Ayudan"


El backend está programado en Go

Frontend programado en React


previamente se debe haber corrido el script de db.


Entrega Framework e interoperabilidad:
Para correr la aplicación hace falta instanciar la base de datos ManosQueAyudanFramework.
Los archivos relevantes para la entrega serian:

-Frontend
 -src
  -hooks
    -useLocationPicker
    -useLocationPickerTest
    -useCountriesCombo
  -components
    -LocationPicker
        -LocationPicker.jsx
        -locationPicker.test.jsx
    -ProfileForm
        -ProfileForm.jsx (donde esta el componente location picker y la llamada de soap)
-BackEnd
 -main.go
 -services
  -CountryService.go

en app.jsx se ven las rutas para la visualización del componente, si se quiere ahorrar la creación del usuario y demas, tendría que ir a la ruta "LocationPickerTest", el soap estaria en profileForm y es un listado de paises.

para correr el proyecto hay que pararse con la consola en la carpeta de front-end y escribir npm start.