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
?>