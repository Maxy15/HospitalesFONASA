$(document).ready(function(){
  obtenerHospitales();
});

function obtenerHospitales(){
  $.ajax({
    url: './PHP/backend.php',
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
                <p class="mt-2 text-center card-title">${hospital.nombre}</p>
              </div>
            </div>
          `;

          var cardElement = $(cardHtml);
          cardElement.click((function(hospitalID) {
            return function() {
              mostrarPacientesHospital(hospitalID);
              mostrarConsultasHospital(hospitalID);
              $('#menu-botones').removeClass('d-none');
              localStorage.setItem('hospitalID', hospitalID);
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
    url: './PHP/backend.php',
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
      console.log('Error al obtener los detalles de los pacientes: ' + error);
    }
  });
}

function construirTablaPacientes(tablaId, pacientes) {
  const tabla = document.getElementById(tablaId);
  tabla.innerHTML = '';
  // Crear el encabezado de la tabla
  const encabezado = document.createElement('thead');

  const nombreTabla = document.createElement('tr');
  nombreTabla.innerHTML = `<th class="table-info border border-info">${tablaId.toUpperCase()}</th>`;
  encabezado.appendChild(nombreTabla);

  const encabezadoFila = document.createElement('tr');
  if (tablaId === 'infantes'){
    encabezadoFila.innerHTML = `<th class="table-info border border-info">Nombre</th>
                                <th class="table-info border border-info">Edad</th>
                                <th class="table-info border border-info">Peso - estatura</th>
                                <th class="table-info border border-info">Prioridad</th>
                                <th class="table-info border border-info">Riesgo</th>
                                <th class="table-info border border-info">Ingreso</th>`;
  }
  if (tablaId === 'jovenes'){
    encabezadoFila.innerHTML = `<th class="table-info border border-info">Nombre</th>
                                <th class="table-info border border-info">Edad</th>
                                <th class="table-info border border-info">Fumador</th>
                                <th class="table-info border border-info">Años fumando</th>
                                <th class="table-info border border-info">Prioridad</th>
                                <th class="table-info border border-info">Riesgo</th>
                                <th class="table-info border border-info">Ingreso</th>`;
  }
  if (tablaId === 'ancianos'){
    encabezadoFila.innerHTML = `<th class="table-info border border-info">Nombre</th>
                                <th class="table-info border border-info">Edad</th>
                                <th class="table-info border border-info">Dieta</th>
                                <th class="table-info border border-info">Prioridad</th>
                                <th class="table-info border border-info">Riesgo</th>
                                <th class="table-info border border-info">Ingreso</th>`;
  }
  encabezado.appendChild(encabezadoFila);
  tabla.appendChild(encabezado);

  // Crear el cuerpo de la tabla
  const cuerpo = document.createElement('tbody');
  pacientes.forEach(paciente => {
    const fila = document.createElement('tr');
    const ultimoIngreso = paciente.ultimoIngreso;
    if (tablaId === 'infantes'){
        fila.innerHTML = `<td class="border border-info">${paciente.nombre}</td>
                          <td class="border border-info">${paciente.edad}</td>
                          <td class="border border-info">${paciente.infantePesoEstatura}</td>
                          <td class="border border-info">${paciente.infantePrioridad}</td>
                          <td class="border border-info">${paciente.infanteRiesgo}</td>
                          <td class="border border-info">${paciente.ultimoIngreso}</td>`;
    }
    if (tablaId === 'jovenes'){
        fila.innerHTML = `<td class="border border-info">${paciente.nombre}</td>
                          <td class="border border-info">${paciente.edad}</td>
                          <td class="border border-info">${paciente.jovenFumador === '1' ? 'Si' : 'No'}</td>
                          <td class="border border-info">${paciente.jovenAñosFumador}</td>
                          <td class="border border-info">${paciente.jovenPrioridad}</td>
                          <td class="border border-info">${paciente.jovenRiesgo}</td>
                          <td class="border border-info">${paciente.ultimoIngreso}</td>`;
    }
    if (tablaId === 'ancianos'){
      fila.innerHTML = `<td class="border border-info">${paciente.nombre}</td>
                        <td class="border border-info">${paciente.edad}</td>
                        <td class="border border-info">${paciente.ancianoDieta === '1' ? 'Si' : 'No'}</td>
                        <td class="border border-info">${paciente.ancianoPrioridad}</td>
                        <td class="border border-info">${paciente.ancianoRiesgo}</td>
                        <td class="border border-info">${paciente.ultimoIngreso}</td>`;
  }
    
    cuerpo.appendChild(fila);
  });
  tabla.appendChild(cuerpo);
}

function mostrarConsultasHospital(hospitalID){
  $.ajax({
    url: './PHP/backend.php',
    type: 'GET',
    dataType: 'json',
    data: { action: 'consultas', hospitalID: hospitalID },
    success: function(data){
      $('#consultas').removeClass('d-none');
      const tabla = document.getElementById('tabla-consultas');
      tabla.innerHTML = '';
      const encabezado = document.createElement('thead');
      const encabezadoFila = document.createElement('tr');
      encabezadoFila.innerHTML = `<th class="table-info border border-info">Consulta</th>
                                  <th class="table-info border border-info">Especialista</th>
                                  <th class="table-info border border-info">Tipo</th>
                                  <th class="table-info border border-info">Estado</th>`;
      encabezado.appendChild(encabezadoFila);
      tabla.appendChild(encabezado);

      const cuerpo = document.createElement('tbody');
      data.forEach(consulta => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td class="border border-info">${consulta.ID}</td>
                          <td class="border border-info">${consulta.nombreEspecialista}</td>
                          <td class="border border-info">${consulta.tipoConsulta}</td>
                          <td class="border border-info">${consulta.estado}</td>`;
        cuerpo.appendChild(fila);
      })
      tabla.appendChild(cuerpo);
    },
    error: function(xhr, status, error){
      console.log('Error al obtener los detalles de las consultas: ' + error);
    }
  });
}