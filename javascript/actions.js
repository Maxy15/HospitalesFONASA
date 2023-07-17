$(document).ready(function(){  
    // Manejo del modal
    $('.menu-btn').click(function() {
      var botonTexto = $(this).text();
      $('#accionModalLabel').text(botonTexto);
  
      $('#accionContenido').text('Se ha hecho clic en el botón "' + botonTexto + '"');
  
      $('#accionModal').modal('show');
    });
  });