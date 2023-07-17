$(document).ready(function(){  
  $('.menu-btn').click(function() {
    var botonTexto = $(this).text();
    var hospitalID = localStorage.getItem('hospitalID');

    switch(botonTexto){
      case 'Mayor edad':
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
      
      case 'Mejor consulta':
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

      case 'Fumadores urgentes':
        $.ajax({
          url: './PHP/backend.php',
          type: 'GET',
          dataType: 'json',
          data: { action: 'fumadoresUrgentes', hospitalID: hospitalID },
          success: function(data){
            $('#accionModalLabel').text('Fumadores que necesitan atención urgente');
            $('#accionContenido').text(`Lista`);
            if (data && data.length > 0) {
              const lista = $('<ol></ol>');
              data.forEach((fumador) => {
                const itemLista = $('<li></li>').text(`${fumador.nombre} con riesgo ${fumador.riesgo}`);
                lista.append(itemLista);
              });
              $('#accionContenido').empty().append(lista);
            } else {
              const mensaje = $('<p></p>').text('No hay pacientes fumadores en la sala de espera');
              $('#accionContenido').empty().append(mensaje);
            }
          },
          error: function(xhr, status, error){
            console.log('Error al obtener los detalles del hospital: ' + error);
          }
        });

      default:
        $('#accionModalLabel').text(botonTexto);
        $('#accionContenido').text('Se ha hecho clic en el botón "' + botonTexto + '"');
    }

    $('#accionModal').modal('show');
  });
});