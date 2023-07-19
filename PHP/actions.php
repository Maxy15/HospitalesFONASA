<?php
	function obtenerMasAnciano($connection){
		$hospitalID = $_GET["hospitalID"];
		$sql = "SELECT p.nombre, p.edad
						FROM paciente p
						INNER JOIN anciano a ON p.ID = a.pacienteID
						WHERE p.hospitalID = $hospitalID
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
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID)
                   ) AS riesgo
            FROM paciente p
            WHERE p.ID = $pacienteID
            AND p.hospitalID = $hospitalID
            UNION
            SELECT p.nombre, 
                   COALESCE(
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID)
                   ) AS riesgo
            FROM paciente p
            WHERE p.hospitalID = $hospitalID AND 
                COALESCE(
                    (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID), 
                    (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID), 
                    (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID)
                  ) >= (
                    SELECT COALESCE(
                      (SELECT i.riesgo FROM infante i WHERE i.pacienteID = p.ID), 
                      (SELECT j.riesgo FROM joven j WHERE j.pacienteID = p.ID), 
                      (SELECT a.riesgo FROM anciano a WHERE a.pacienteID = p.ID)
                    ) AS riesgo
                    FROM paciente p
                    WHERE p.ID = $pacienteID
                    AND p.hospitalID = $hospitalID
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
?>