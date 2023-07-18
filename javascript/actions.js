$('.menu-btn').click(function() {
  var botonTexto = $(this).text().trim();
  var hospitalID = localStorage.getItem('hospitalID');
  var modalContenido = '';

  switch (botonTexto) {
    case 'Mayor edad':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'masAnciano', hospitalID: hospitalID },
        success: function(data) {
          modalContenido = `${data[0].nombre} con ${data[0].edad} años`;
          mostrarModal('Paciente anciano con más edad', modalContenido);
        },
        error: function(xhr, status, error) {
          console.log('Error al buscar al paciente más anciano: ' + error);
        }
      });
      break;
    case 'Mejor consulta':
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'mejorConsulta', hospitalID: hospitalID },
        success: function(data) {
          if (data && data.length > 0) {
            modalContenido = `Consulta Nº${data[0].ID} [Dr(a) ${data[0].nombreEspecialista}] con ${data[0].cantidadPacientes} pacientes atendidos`;
          } else {
            modalContenido = 'No se encontraron consultas registradas.';
          }
          mostrarModal('Consulta con más pacientes atendidos', modalContenido);
        },
        error: function(xhr, status, error) {
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
        success: function(data) {
          if (data && data.length > 0) {
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
        error: function(xhr, status, error) {
          console.log('Error al obtener los fumadores urgentes: ' + error);
        }
      });
      break;
    default:
      modalContenido = 'Se ha hecho clic en el botón "' + botonTexto + '"';
      mostrarModal(botonTexto, modalContenido);
      break;
  }
});

function mostrarModal(titulo, contenido) {
  $('#accionModalLabel').text(titulo);
  $('#accionContenido').html(contenido);
  $('#accionModal').modal('show');
}
