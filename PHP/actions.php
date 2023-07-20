<?php
	function obtenerMasAnciano($connection){
		$hospitalID = $_GET["hospitalID"];
		$sql = "SELECT p.nombre, p.edad
						FROM paciente p
						INNER JOIN anciano a ON p.ID = a.pacienteID
						WHERE p.hospitalID = $hospitalID
            AND p.estado = 'En sala de espera'
						ORDER BY p.edad DESC
						LIMIT 1;";
		$data = ExecuteQuery($sql, $connection);
		echo json_encode($data);
	}

	function obtenerMejorConsulta($connection){
		$hospitalID = $_GET["hospitalID"];
		$sql = "SELECT ID, nombreEspecialista, tipoConsulta, cantidadPacientes
						FROM consulta
						WHERE hospitalID = $hospitalID
						ORDER BY cantidadPacientes DESC
						LIMIT 1;";
		$data = ExecuteQuery($sql, $connection);
		echo json_encode($data);
	}

	function obtenerFumadoresUrgentes($connection){
		$hospitalID = $_GET["hospitalID"];
		$sql = "SELECT p.nombre, j.riesgo
						FROM paciente p
						INNER JOIN joven j ON p.ID = j.pacienteID
						WHERE p.hospitalID = $hospitalID
            AND p.estado = 'En sala de espera'
						AND j.fumador = 1
						ORDER BY j.riesgo DESC
						LIMIT 5;";
		$data = ExecuteQuery($sql, $connection);
		echo json_encode($data);
	}

  function obtenerPacientesConMayorRiesgo($connection){
    $pacienteID = $_GET["pacienteID"];
    $hospitalID = $_GET["hospitalID"];
    $sql = "SELECT p.nombre, 
                   COALESCE(
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID AND p.estado = 'En sala de espera')
                   ) AS riesgo
            FROM paciente p
            WHERE p.ID = $pacienteID
            AND p.hospitalID = $hospitalID
            AND p.estado = 'En sala de espera'
            UNION
            SELECT p.nombre, 
                   COALESCE(
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID AND p.estado = 'En sala de espera')
                   ) AS riesgo
            FROM paciente p
            WHERE p.hospitalID = $hospitalID AND
                  p.estado = 'En sala de espera' AND 
                COALESCE(
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID AND p.estado = 'En sala de espera')
                  ) >= (
                    SELECT COALESCE(
                      (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                      (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID AND p.estado = 'En sala de espera'), 
                      (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID AND p.estado = 'En sala de espera')
                    ) AS riesgo
                    FROM paciente p
                    WHERE p.ID = $pacienteID
                    AND p.hospitalID = $hospitalID
                    AND p.estado = 'En sala de espera'
                  )
            ORDER BY riesgo DESC;";
    $data = ExecuteQuery($sql, $connection);
    echo json_encode($data);
  }

  function liberarConsultas($connection){
		$hospitalID = $_GET["hospitalID"];
		$sql = "UPDATE consulta 
            SET estado = 'En espera de paciente'
            WHERE hospitalID = $hospitalID;";
		$result = Execute($sql, $connection);
		echo json_encode($result);
	}

  function atenderPaciente($connection){
    $hospitalID = $_GET["hospitalID"];
    
    $sql = "SELECT p.ID, p.nombre,
            CASE
              WHEN (SELECT i.prioridad FROM infante i WHERE i.pacienteID = p.ID) IS NOT NULL THEN 'Infante'
              WHEN (SELECT j.prioridad FROM joven j WHERE j.pacienteID = p.ID) IS NOT NULL THEN 'Joven'
              WHEN (SELECT a.prioridad FROM anciano a WHERE a.pacienteID = p.ID) IS NOT NULL THEN 'Anciano'
              ELSE 'Tipo desconocido'
            END AS tipo,
            COALESCE(
              (SELECT i.prioridad FROM infante i WHERE i.pacienteID = p.ID),
              (SELECT j.prioridad FROM joven j WHERE j.pacienteID = p.ID),
              (SELECT a.prioridad FROM anciano a WHERE a.pacienteID = p.ID)
            ) AS prioridad
            FROM paciente p
            WHERE p.estado = 'En sala de espera'
            AND p.hospitalID = $hospitalID
            ORDER BY prioridad DESC
            LIMIT 1;";
    
    $result = ExecuteQuery($sql, $connection);
    $paciente = $result[0];

    if (!$paciente){
      $response = array('nombre' => '', 'tipoConsulta' => '', 'consultaID' => '');
    } else {
      $pacienteID = $paciente['ID'];
      $nombrePaciente = $paciente['nombre'];
      $tipoPaciente = $paciente['tipo'];
      $prioridad = $paciente['prioridad'];

      $tipoConsulta = 'General';
      $tipoCondicion = "AND (tipoConsulta = 'Urgencias' OR tipoConsulta = 'General')";
      if ($tipoPaciente === 'Infante' && $prioridad <= 4){
        $tipoConsulta = 'Pediatría';
        $tipoCondicion = "AND tipoConsulta = 'Pediatría'";
      } elseif ($prioridad > 4) {
        $tipoConsulta = 'Urgencias';
        $tipoCondicion = "AND tipoConsulta = 'Urgencias'";
      }

      $sql2 = "SELECT ID, tipoConsulta, cantidadPacientes
                FROM consulta
                WHERE hospitalID = $hospitalID
                $tipoCondicion
                AND estado = 'En espera de paciente'
                LIMIT 1;";

      $data = ExecuteQuery($sql2, $connection);

      if (!$data || count($data) === 0){
        $response = array('nombre' => '', 'tipoConsulta' => '', 'consultaID' => '');
      } else {
        $consultaID = $data[0]['ID'];
        $tipoConsulta = $data[0]['tipoConsulta'];
        $cantidadPacientes = $data[0]['cantidadPacientes'] + 1;

        $sqlUpdatePaciente = "UPDATE paciente SET estado = 'Atendido' WHERE ID = $pacienteID;";
        $sqlUpdateConsulta = "UPDATE consulta SET estado = 'Ocupada', cantidadPacientes = $cantidadPacientes WHERE ID = $consultaID;";
        Execute($sqlUpdatePaciente, $connection);
        Execute($sqlUpdateConsulta, $connection);

        $response = array('nombre' => $nombrePaciente, 'tipoConsulta' => $tipoConsulta, 'consultaID' => $consultaID);
      }              
    }
    echo json_encode($response);
	}
?>