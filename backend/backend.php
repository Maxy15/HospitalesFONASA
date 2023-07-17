<?php
  include './common/config.php';
  include './common/mysql.php';

  $connection = Connect($config['database']);

  if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $action = $_GET["action"];

    if ($action === 'hospitales') {
      obtenerHospitales($connection);
    }

    if ($action === 'pacientes'){
      obtenerPacientes($connection);
    }

    if ($action === 'consultas'){
      obtenerConsultas($connection);
    }
  }
  mysqli_close($connection);

  function obtenerHospitales($connection) {
    $sql = "SELECT * FROM hospital";
    $data = ExecuteQuery($sql, $connection);
    echo json_encode($data);
  }

  function obtenerPacientes($connection){
    $hospitalID = $_GET["hospitalID"];
    $sql = "SELECT
              p.nombre,
              p.edad,
              p.estatura,
              p.peso,
              p.ultimoIngreso,
              'Infante' AS categoria,
              i.pesoEstatura AS infantePesoEstatura,
              i.prioridad AS infantePrioridad,
              i.riesgo AS infanteRiesgo,
              NULL AS jovenFumador,
              NULL AS jovenAñosFumador,
              NULL AS jovenPrioridad,
              NULL AS jovenRiesgo,
              NULL AS ancianoDieta,
              NULL AS ancianoPrioridad,
              NULL AS ancianoRiesgo
            FROM paciente p INNER JOIN infante i ON p.ID = i.pacienteID
            WHERE p.hospitalID = $hospitalID
            UNION
            (SELECT
              p.nombre,
              p.edad,
              p.estatura,
              p.peso,
              p.ultimoIngreso,
              'Joven' AS categoria,
              NULL AS infantePesoEstatura,
              NULL AS infantePrioridad,
              NULL AS infanteRiesgo,
              j.fumador AS jovenFumador,
              j.añosFumador AS jovenAñosFumador,
              j.prioridad AS jovenPrioridad,
              j.riesgo AS jovenRiesgo,
              NULL AS ancianoDieta,
              NULL AS ancianoPrioridad,
              NULL AS ancianoRiesgo
            FROM paciente p INNER JOIN joven j ON p.ID = j.pacienteID
            WHERE p.hospitalID = $hospitalID)
            UNION
            (SELECT
              p.nombre,
              p.edad,
              p.estatura,
              p.peso,
              p.ultimoIngreso,
              'Anciano' AS categoria,
              NULL AS infantePesoEstatura,
              NULL AS infantePrioridad,
              NULL AS infanteRiesgo,
              NULL AS jovenFumador,
              NULL AS jovenAñosFumador,
              NULL AS jovenPrioridad,
              NULL AS jovenRiesgo,
              a.dieta AS ancianoDieta,
              a.prioridad AS ancianoPrioridad,
              a.riesgo AS ancianoRiesgo
            FROM paciente p INNER JOIN anciano a ON p.ID = a.pacienteID
            WHERE p.hospitalID = $hospitalID)
            ORDER BY infantePrioridad DESC, jovenPrioridad DESC, ancianoPrioridad DESC, ultimoIngreso ASC;";
    $data = ExecuteQuery($sql, $connection);
    echo json_encode($data);
  }

  function obtenerConsultas($connection) {
    $hospitalID = $_GET["hospitalID"];
    $sql = "SELECT * FROM consulta WHERE hospitalID = $hospitalID";
    $data = ExecuteQuery($sql, $connection);
    echo json_encode($data);
  }
?>