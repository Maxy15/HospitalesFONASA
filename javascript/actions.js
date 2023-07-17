$(document).ready(function(){  
  $('.menu-btn').click(function() {
    var botonTexto = $(this).text();
    var hospitalID = localStorage.getItem('hospitalID');

    if (botonTexto === 'Mayor edad'){
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'masAnciano', hospitalID: hospitalID },
        success: function(data){
          $('#accionModalLabel').text('Paciente más anciano');
          $('#accionContenido').text(`${data[0].nombre} con ${data[0].edad} años`)
        },
        error: function(xhr, status, error){
          console.log('Error al obtener los detalles del hospital: ' + error);
        }
      });
    }
    else if (botonTexto === 'Mejor consulta'){
      $.ajax({
        url: './PHP/backend.php',
        type: 'GET',
        dataType: 'json',
        data: { action: 'mejorConsulta', hospitalID: hospitalID },
        success: function(data){
          $('#accionModalLabel').text('Consulta que ha atendido más pacientes');
          $('#accionContenido').text(`Consulta Nº${data[0].ID} [Dr(a) ${data[0].nombreEspecialista}] 
                                      con ${data[0].cantidadPacientes} pacientes atendidos`);
        },
        error: function(xhr, status, error){
          console.log('Error al obtener los detalles del hospital: ' + error);
        }
      });
    }
    else {
      $('#accionModalLabel').text(botonTexto);
      $('#accionContenido').text('Se ha hecho clic en el botón "' + botonTexto + '"');
    }

    $('#accionModal').modal('show');
  });
});