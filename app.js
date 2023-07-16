$(document).ready(function(){
  obtenerHospitales();
});

function obtenerHospitales(){
  $.ajax({
    url: './backend/backend.php',
    type: 'GET',
    dataType: 'json',
    data: { action: 'hospitales' },
    success: function(data) {
      const hospitalesDiv = $('#hospitales');
      var rowDiv = $('<div class="row justify-content-center"></div>');

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var hospital = data[key];
          var cardHtml = `
            <div id="${hospital.ID}" class="col-md-6">
              <div class="card">
                <img src="./images/hospital.jpeg" class="card-img-top" alt="${hospital.nombre}">
                <h5 class="mt-2 text-center card-title">${hospital.nombre}</h5>
              </div>
            </div>
          `;

          var cardElement = $(cardHtml);
          cardElement.click((function(hospitalID) {
            return function() {
              mostrarPacientesHospital(hospitalID);
              mostrarConsultasHospital(hospitalID);
            };
          })(hospital.ID));
          rowDiv.append(cardElement);
        }
      }

      hospitalesDiv.append(rowDiv);
    },
    error: function(xhr, status, error){
      console.log('Error al obtener los datos de los hospitales: ' + error);
    }
  });
}

function mostrarPacientesHospital(hospitalID){
  $.ajax({
    url: './backend/backend.php',
    type: 'GET',
    dataType: 'json',
    data: { action: 'pacientes', hospitalID: hospitalID },
    success: function(data){
      $('#pacientes').removeClass('d-none');
      const infantes = data.filter(paciente => paciente.categoria === 'Infante');
      const jovenes = data.filter(paciente => paciente.categoria === 'Joven');
      const ancianos = data.filter(paciente => paciente.categoria === 'Anciano');
      construirTablaPacientes('infantes', infantes);
      construirTablaPacientes('jovenes', jovenes);
      construirTablaPacientes('ancianos', ancianos);
    },
    error: function(xhr, status, error){
      console.log('Error al obtener los detalles del hospital: ' + error);
    }
  });
}

function construirTablaPacientes(tablaId, pacientes) {
  const tabla = document.getElementById(tablaId);
  tabla.innerHTML = '';
  // Crear el encabezado de la tabla
  const encabezado = document.createElement('thead');

  const nombreTabla = document.createElement('tr');
  nombreTabla.innerHTML = `<th class="nombre-tabla">${tablaId.charAt(0).toUpperCase() + tablaId.slice(1).toLowerCase()}</th>`;
  encabezado.appendChild(nombreTabla);

  const encabezadoFila = document.createElement('tr');
  if (tablaId === 'infantes'){
    encabezadoFila.innerHTML = `<th>Nombre</th>
                                <th>Edad</th>
                                <th>Peso - estatura</th>
                                <th>Prioridad</th>
                                <th>Riesgo</th>
                                <th>Ingreso</th>`;
  }
  if (tablaId === 'jovenes'){
    encabezadoFila.innerHTML = `<th>Nombre</th>
                                <th>Edad</th>
                                <th>Fumador</th>
                                <th>Años fumando</th>
                                <th>Prioridad</th>
                                <th>Riesgo</th>
                                <th>Ingreso</th>`;
  }
  if (tablaId === 'ancianos'){
    encabezadoFila.innerHTML = `<th>Nombre</th>
                                <th>Edad</th>
                                <th>Dieta</th>
                                <th>Prioridad</th>
                                <th>Riesgo</th>
                                <th>Ingreso</th>`;
  }
  encabezado.appendChild(encabezadoFila);
  tabla.appendChild(encabezado);

  // Crear el cuerpo de la tabla
  const cuerpo = document.createElement('tbody');
  pacientes.forEach(paciente => {
    const fila = document.createElement('tr');
    if (tablaId === 'infantes'){
        fila.innerHTML = `<td>${paciente.nombre}</td>
                          <td>${paciente.edad}</td>
                          <td>${paciente.infantePesoEstatura}</td>
                          <td>${paciente.infantePrioridad}</td>
                          <td>${paciente.infanteRiesgo}</td>
                          <td>${paciente.ultimoIngreso}</td>`;
    }
    if (tablaId === 'jovenes'){
        fila.innerHTML = `<td>${paciente.nombre}</td>
                          <td>${paciente.edad}</td>
                          <td>${paciente.jovenFumador === '1' ? 'Si' : 'No'}</td>
                          <td>${paciente.jovenAñosFumador}</td>
                          <td>${paciente.jovenPrioridad}</td>
                          <td>${paciente.jovenRiesgo}</td>
                          <td>${paciente.ultimoIngreso}</td>`;
    }
    if (tablaId === 'ancianos'){
      fila.innerHTML = `<td>${paciente.nombre}</td>
                        <td>${paciente.edad}</td>
                        <td>${paciente.ancianoDieta === '1' ? 'Si' : 'No'}</td>
                        <td>${paciente.ancianoPrioridad}</td>
                        <td>${paciente.ancianoRiesgo}</td>
                        <td>${paciente.ultimoIngreso}</td>`;
  }
    
    cuerpo.appendChild(fila);
  });
  tabla.appendChild(cuerpo);
}

function mostrarConsultasHospital(hospitalID){
  $.ajax({
    url: './backend/backend.php',
    type: 'GET',
    dataType: 'json',
    data: { action: 'consultas', hospitalID: hospitalID },
    success: function(data){
      $('#consultas').removeClass('d-none');
      const tabla = document.getElementById('consultas');
      tabla.innerHTML = '';
      const encabezado = document.createElement('thead');
      const encabezadoFila = document.createElement('tr');
      encabezadoFila.innerHTML = `<th>Consulta</th>
                                  <th>Especialista</th>
                                  <th>Tipo</th>
                                  <th>Estado</th>`;
    },
    error: function(xhr, status, error){
      console.log('Error al obtener los detalles del hospital: ' + error);
    }
  });
}