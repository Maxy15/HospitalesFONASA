$('.menu-btn').click(function(){
  var botonTexto = $(this).text().trim();
  var hospitalID = localStorage.getItem('hospitalID');
  var modalContenido = '';

  switch (botonTexto){
    case 'Mayor riesgo':
      var formulario = `<form class="p-3">
                          <div class="form-group">
                            <label for="pacienteID">Ingrese ID del paciente</label>
                            <input type="text" class="form-control border border-info" id="pacienteID">
                          </div>
                          <button type="submit" class="btn btn-info font-weight-light">Buscar</button>
                          <div id="pacientes-riesgosos" class="my-3"></div>
                        </form>`;
      mostrarModal('Buscar pacientes más riesgosos', formulario);
    
      $('#accionContenido form').submit(function(event){
        event.preventDefault();
        var pacienteID = $('#pacienteID').val();
        $.ajax({
          url: './PHP/backend.php',
          type: 'GET',
          dataType: 'json',
          data: { action: 'mayorRiesgo', pacienteID: pacienteID, hospitalID: hospitalID },
          success: function(data){
            var pacientesRiesgososDiv = $('#pacientes-riesgosos');
            pacientesRiesgososDiv.empty();

            if (data){
              var pacienteBuscado = data.slice(-1)[0];
              var otrosPacientes = data.slice(0, -1);

              var titulo = `Pacientes con riesgo mayor que ${pacienteBuscado.nombre} (${pacienteBuscado.riesgo})`;
              var tituloElemento = $('<p class="font-weight-bold"></p>').text(titulo);
              pacientesRiesgososDiv.append(tituloElemento);
              
              if (otrosPacientes.length > 0){
                var lista = $('<ol></ol>');
                otrosPacientes.forEach(function(paciente) {
                  var itemLista = $('<li></li>').text(`${paciente.nombre} (${paciente.riesgo})`);
                  lista.append(itemLista);
                });
                pacientesRiesgososDiv.append(lista);
              } else {
                var mensaje = 'No hay pacientes con mayor riesgo que el paciente buscado';
                var mensajeElemento = $('<p></p>').text(mensaje);
                pacientesRiesgososDiv.append(mensajeElemento);
              }
            } else {
              var mensaje = 'Paciente ingresado no existe';
              var mensajeElemento = $('<p class="text-info"></p>').text(mensaje);
              pacientesRiesgososDiv.append(mensajeElemento);
            }
          },
          error: function(xhr, status, error){
            console.log('Error al buscar los pacientes con mayor riesgo que el seleccionado: ' + error);
          }
        });
      });
      break;
    case 'Mejor consulta':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'mejorConsulta', hospitalID: hospitalID },
        success: function(data){
          if (data && data.length > 0){
            modalContenido = `Consulta Nº${data[0].ID} [Dr(a) ${data[0].nombreEspecialista}] con ${data[0].cantidadPacientes} pacientes atendidos`;
          } else {
            modalContenido = 'No se encontraron consultas registradas.';
          }
          mostrarModal('Consulta con más pacientes atendidos', modalContenido);
        },
        error: function(xhr, status, error){
          console.log('Error al buscar la mejor consulta: ' + error);
        }
      });
      break;
    case 'Fumadores urgentes':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'fumadoresUrgentes', hospitalID: hospitalID },
        success: function(data){
          if (data && data.length > 0){
            const lista = $('<ol></ol>');
            data.forEach((fumador) => {
              const itemLista = $('<li></li>').text(`${fumador.nombre} con riesgo ${fumador.riesgo}`);
              lista.append(itemLista);
            });
            modalContenido = lista;
          } else {
            modalContenido = 'No hay pacientes fumadores en la sala de espera';
          }
          mostrarModal('Fumadores que necesitan atención urgente', modalContenido);
        },
        error: function(xhr, status, error){
          console.log('Error al obtener los fumadores urgentes: ' + error);
        }
      });
      break;
    case 'Mayor edad':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'masAnciano', hospitalID: hospitalID },
        success: function(data){
          modalContenido = `${data[0].nombre} con ${data[0].edad} años`;
          mostrarModal('Paciente anciano con más edad', modalContenido);
        },
        error: function(xhr, status, error){
          console.log('Error al buscar al paciente más anciano: ' + error);
        }
      });
      break;
    case 'Liberar consultas':
      modalContenido = `<div class="p-3">
                          <p>¿Estás segur@ de actualizar el estado a "En espera de paciente" en todas las consultas?</p>
                          <button id="liberar-consultas" class="btn btn-info font-weight-light">Aceptar</button>
                        </div>`;
      mostrarModal(botonTexto, modalContenido);
      $('#liberar-consultas').click(function(){
        $.ajax({
          url: './PHP/backend.php',
          type: 'GET',
          dataType: 'json',
          data: { action: 'liberarConsultas', hospitalID: hospitalID },
          success: function(data){
            console.log(data);
            location.reload();
          },
          error: function(xhr, status, error){
            console.log('Error al buscar al paciente más anciano: ' + error);
          }
        });
      })
      break;
    case 'Atender paciente':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'atenderPaciente', hospitalID: hospitalID },
        success: function(data){
          if (data.nombre){
            modalContenido = `
              <div class="p-3">
                <p>Paciente ${data.nombre} está siendo atendid@ en la consulta Nº${data.consultaID} de tipo ${data.tipoConsulta}</p>
                <button id="btn-entendido" class="btn btn-info font-weight-light">Entendido</button>
              </div>`;
            $(document).on('click', '#btn-entendido', function(){
              location.reload();
            });
          } else {
            modalContenido = 'No se puede atender pacientes en este momento';
          }
          mostrarModal(botonTexto, modalContenido);
        },
        error: function(xhr, status, error){
          console.log('Error al intentar atender paciente: ' + error);
        }
      });
      break;
  }
});

function mostrarModal(titulo, contenido){
  $('#accionModalLabel').text(titulo);
  $('#accionContenido').html(contenido);
  $('#accionModal').modal('show');
}
