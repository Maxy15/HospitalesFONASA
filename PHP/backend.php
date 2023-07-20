<?php
  include './mysql.php';
  include './setup.php';
  include './actions.php';

  $connection = Connect($config['database']);

  if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $action = $_GET["action"];

    switch ($action){
      // Setup
      case 'hospitales':
        obtenerHospitales($connection);
        break;
      case 'pacientes':
        obtenerPacientes($connection);
        break;
      case 'consultas':
        obtenerConsultas($connection);
        break;

      // Actions
      case 'mayorRiesgo':
        obtenerPacientesConMayorRiesgo($connection);
        break;
      case 'mejorConsulta':
        obtenerMejorConsulta($connection);
        break;
      case 'fumadoresUrgentes':
        obtenerFumadoresUrgentes($connection);
        break;
      case 'masAnciano':
        obtenerMasAnciano($connection);
        break;
      case 'liberarConsultas':
        liberarConsultas($connection);
        break;
      case 'atenderPaciente':
        atenderPaciente($connection);
        break;
    }
  }
  mysqli_close($connection);
?>