
# Aula Chupetes - Servidor
Aplicación para gestionar los datos de aulas infantiles.
Esta aplicación tiene como objetivo facilitar la gestión de un aula infantil.

[![Generic badge](https://img.shields.io/badge/Laravel-8.12-red.svg)](https://laravel.com)
[![Generic badge](https://img.shields.io/badge/Passport-10.1-orange.svg)](https://laravel.com/docs/8.x/passport) 
[![Generic badge](https://img.shields.io/badge/PHP-8.0.2-blue.svg)](https://www.php.net) 
[![Generic badge](https://img.shields.io/badge/MariaDB-10.5.8-green.svg)](https://mariadb.org) 
[![Generic badge](https://img.shields.io/badge/Docker-3.8-42b983.svg)](https://www.docker.com/) 

## Acerca de 
Este repositorio contiene los ficheros para poner en marcha la parte del servidor de la aplicación Aula Chupetes.

Este repositorio está relacionado con el Cliente web contenido en el repositorio de [Github](https://github.com/rnavas81/Aula-Chupete--Servidor)

## Manual de instalación local

### Docker
Para realizar la instalación local debe tener instalado un cliente de docker

Para la instalación de Docker puede acceder a [Documentación oficial de Docker](https://docs.docker.com/get-docker/). Ahi encontrar la instacion dependiende de su sistema operativo ademas de guias sobre el uso de Docker.

### Git
Aunque no es necesario, si es recomendable tener instalado git en la maquina donde se va a ejecutar la aplicación.

Para la instalación de git puede acceder a la [Documentación oficial](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Puesta en marcha
Para empezar debe descargar o clonar el repositorio.
Si en la máquina donde va a ejecutar la aplicación tiene instalado git puede ejecutar el siguiente comando por consola :
1. Situese en la carpeta que contendrá la aplicación

2. Descomprima o clone este repositorio

    *git clone https://github.com/rnavas81/Aula-Chupete--Cliente*

3. Situese dentro de la carpeta Aula-Chupete--Cliente

    *cd Aula-Chupete--Cliente*

4. Lance el comando para inicializar el contenedor docker

    *sudo docker-compose up -d*

Es posible que la aplicación tarde un poco en estar operativa, por favor tenga paciencia 
Si tiene dudas lance este comando para ver las últimas acciones

*docker logs -f --until=2s*
  

### Su aplicación estará lista para funcionar!!!
Puede acceder a ella desde la [url](http://localhost:1001)
