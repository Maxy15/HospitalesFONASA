<?php
  include './mysql.php';
  include './setup.php';
  include './actions.php';

  $connection = Connect($config['database']);

  if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $action = $_GET["action"];

    switch ($action){
      case 'hospitales':
        obtenerHospitales($connection);
        break;
      case 'pacientes':
        obtenerPacientes($connection);
        break;
      case 'consultas':
        obtenerConsultas($connection);
        break;
    }
  }
  mysqli_close($connection);
?>