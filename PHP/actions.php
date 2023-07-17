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
?>