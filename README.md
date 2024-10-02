# ManosQueAyudan
Repositorio de el proyecto tp final "Manos que Ayudan"


El backend está programado en Go

Frontend programado en React

para correr el back necesitas posicionarte en back end y poner go run main.go, anda habiendo un problema con el modelado de proyectos_usuarios :
Error 1068 (42000): Multiple primary key defined
[0.501ms] [rows:0] ALTER TABLE `proyectos_usuarios` ADD `id_proyecto` int unsigned, ADD PRIMARY KEY (`id_proyecto`)
2024/10/01 23:35:40 Failed to initialize database: failed to migrate *models.Usuario: Error 1068 (42000): Multiple primary key defined
exit status 1
Después de arreglar este probablemente salte otro. una vez que termine esto podemos continuar con la historia y chequear para que el login ande nuevamente.

Previo a hacer esto recomendaria borrar la base de datos y reinstalarla con el migrador para agarrar envion con el uso del mismo:
migrate -path ./migrations -database "mysql://user:password@tcp(localhost:3306)/manosqueayudan" up
arriba esta el comando, hay que cambiar el user y la password por lo que tengas seteado