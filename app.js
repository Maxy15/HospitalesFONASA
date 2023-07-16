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
  console.log('Hospital ID', hospitalID);
  $.ajax({
    url: './backend/backend.php',
    type: 'GET',
    dataType: 'json',
    data: { action: 'pacientes', hospitalID: hospitalID },
    success: function(data){
      console.log(data);
    },
    error: function(xhr, status, error){
      console.log('Error al obtener los detalles del hospital: ' + error);
    }
  });
}