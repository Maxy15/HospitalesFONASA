# Hospitales FONASA :hospital:

Sitio web *Hospitales FONASA* cuyo *frontend* fue desarrollado con HTML, CSS, Javascript, JQuery, Bootsrap y la librería Moment. Por otro lado, el *backend* fue creado con PHP y la base de datos con MySQL, además de la ayuda de XAMPP para tener acceso a Apache y phpMyAdmin. La estructura de los archivos y carpetas es la siguiente:

```
HospitalesFONASA
│   ├── index.html
│   ├── README.md
│   ├── documentos
│   |   ├── descripcion.pdf
│   |   ├── Diagrama ER.pdf
│   |   ├── seeds
│   |   |   ├── anciano.csv
│   |   |   ├── consulta.csv
│   |   |   ├── hospital.csv
│   |   |   ├── infante.csv
│   |   |   ├── joven.csv
│   |   |   ├── paciente.csv
│   ├── images
│   |   ├── hospital.jpeg
│   ├── javascript
│   |   ├── actions.js
│   |   ├── setup.js
│   |   ├── lib
│   |   |   ├── moment.min.js
│   ├── PHP
│   |   ├── actions.php
│   |   ├── backend.php
│   |   ├── mysql.php
│   |   ├── setup.php
│   ├── styles
│   |   ├── styles.css
```

## Aspectos generales
La aplicación permite seleccionar un hospital, para posteriormente mostrar los pacientes en la sala de espera y las consultas asociados a ese hospital. Al final, muestra un menú de botones, en donde cada botón corresponde a una de las funcionalidades pedidas. Se implementaron las siguientes funcionalidades:
    * **Mayor riesgo:** Muestra los pacientes que tienen un riesgo mayor al del paciente, identificado por el ID a través de un formulario, que se encuentren en la sala de espera.
    * **Fumadores urgentes:** Muestra los primeros 5 pacientes fumadores que tengan un riesgo mayor.
    * **Mejor consulta:** Muestra la consulta que ha atendido más pacientes.  
    * **Mayor edad:** Muestra el paciente anciano con mayor edad en la sala de espera. 
    * **Liberar consultas:** Actualiza el estado de todas las consultas asociadas al hospital seleccionado a *En espera de paciente*.
    * **Atender:** Selecciona al paciente que tiene más prioridad de la sala de espera y le asigna la consulta que le corresponde según sus características. Si hay consulta disponible, aparece en el modal de respuesta el tipo de la consulta y su ID. De lo contrario, se muestra el mensaje de que no es posible atender a un paciente en estos momentos.

Tanto los archivos JS como PHP siguen este orden para desarrollar cada una de las funcionalidades. 

## Archivos y carpetas importantes
En la carpeta documentos se pueden encontrar las *seeds*, en formato CSV, de ejemplo que fueron creadas para probar la aplicación. Estas pueden ser usadas para poblar las tablas asociadas y también, se encuentra el diagrama entidad - relación de estas. En el archivo *mysql.php* se encuentran los datos para conectarse a la base de datos, los cuales podrían necesitar ser modificados según cada usuario. Dichos datos son los siguientes:

```bash
    $config = array(
        'database' => array(
            'host' => 'localhost',
            'username' => 'root',
            'password' => '',
            'database' => 'training',
            'encoding' => 'utf8'
        ),
    );
```

## Supuestos y simplificaciones
* El ID del paciente se utilizó como número de historia clínica.
* Sólo se consideró la sala de espera y no se implementó la funcionalidad *Optimizar*
* Casi en la totalidad del proyecto se usó el camelCase (estilo Javascript) para los nombres de variables y funciones.

Gracias por el leer :smile_cat: