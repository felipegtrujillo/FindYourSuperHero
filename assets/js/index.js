/* -------------------------------------------------------------------- */
/* FUNCIONES */
/* -------------------------------------------------------------------- */
function validacionInput(Input) {
  let patron = /^(?:[1-9]|[1-9][0-9]|[1-9][0-9][0-9]|7[0-2][0-9]|73[0-1])$/;
  let errorInput = document.getElementById("errorInput");
  let validacion = false;

  if (parseInt(Input) > 731 || parseInt(Input) < 1) {
    errorInput.textContent =
      "Solo Existen 731 SuperHeroes! Por favor Ingrese un numero entre 1 y 731";
    validacion = false;
  } else if (Input.trim().length == 0) {
    errorInput.textContent = "El Numero de SuperHeroe es requerido";
    validacion = false;
  } else if (patron.test(Input)) {
    errorInput.textContent = ""; /* Permitida */
    validacion = true;
  } else {
    errorInput.textContent = "El texto ingresado no es permitido.";
    validacion = false;
  }

  return validacion;
}

function consultaAPI(id) {
  const apiKey = "4905856019427443";
  let contentURL = `https://superheroapi.com/api.php/${apiKey}/${id}`;

  $.ajax({
    type: "GET",
    url: contentURL,
    dataType: "json",
    success: function (data) {
      let obj = transformaDatos(data); /* Transforma data de APi en objeto */
      muestraDatos(obj); /* Renderiza en pantalla los datos respectivos en su div respectivo */
      dibujaCanvas(obj); /* dibuja el canvas con el objeto obtenido */
    },
    error: function (error) {
      muestraError(error);
    },
  });
}

function transformaDatos(datos) {
  let datosOrdenados = [];
  let objeto = {};

  Object.entries(datos).forEach(([clave, valor]) => {
    datosOrdenados.push({ clave, valor });
  });

  let urlimageSH = Object.values( datosOrdenados.find((objeto) => objeto.clave === "image").valor);
  let nameSH = datosOrdenados.find((objeto) => objeto.clave === "name").valor;
  let conexionesSH = Object.values( datosOrdenados.find((objeto) => objeto.clave === "connections").valor);
  let ocupacionSH = datosOrdenados.find((objeto) => objeto.clave === "work").valor.occupation;
  let FirstApSH = datosOrdenados.find((objeto) => objeto.clave === "biography").valor["first-appearance"];
  let alturaSH = datosOrdenados.find((objeto) => objeto.clave === "appearance").valor.height[0];
  let pesoSH = datosOrdenados.find((objeto) => objeto.clave === "appearance").valor.weight[0];
  let alianzasSH = datosOrdenados.find((objeto) => objeto.clave === "biography").valor.aliases;
  let powerstats = Object.entries(datosOrdenados.find((objeto) => objeto.clave === "powerstats").valor
  );

  objeto = {  url: urlimageSH,
              name: nameSH , 
              conexiones: conexionesSH,
              ocupacion: ocupacionSH ,
              firstAp : FirstApSH,
              altura: alturaSH,
              peso: pesoSH,
              alianzas: alianzasSH,
              stats: powerstats };

  return objeto;
}


function dibujaCanvas(objeto) {

  let arreglo = objeto.stats;
  datapoints = arreglo.map((stats) => {
    return { y: parseInt(stats[1]), name: stats[0] };
  });

  var chart = new CanvasJS.Chart("GraficoCanvas", {
    exportEnabled: false,
    animationEnabled: true,
    title: {
      text: `Estadísticas de poder para ${objeto.name}  `,
    },
    legend: {
      cursor: "pointer",
      itemclick: explodePie,
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name}: <strong>{y}</strong>",
        indexLabel: "{name}({y})",
        dataPoints: datapoints,
      },
    ],
  });
  
  chart.render();

  function explodePie(e) {
    if (
      typeof e.dataSeries.dataPoints[e.dataPointIndex].exploded ===
        "undefined" ||
      !e.dataSeries.dataPoints[e.dataPointIndex].exploded
    ) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
  }
}

function muestraDatos(objeto) {
   
  $("#imagenSH").attr("src", objeto.url);
  $("#nameSH").html(` <strong> Nombre: </strong> ${objeto.name}`);
  $("#conexionesSH").html( `<strong>Conexiones </strong>: ${objeto.conexiones}`);
  $("#ocupacionSH").html(`<strong>Ocupacion:</strong> ${objeto.ocupacion}`);
  $("#FirsApSH").html(`<strong>Primera Aparicion:</strong> ${objeto.firstAp }`);
  $("#alturaSH").html(`<strong>Altura:</strong> ${objeto.altura }`);
  $("#pesoSH").html(`<strong>Peso:</strong> ${objeto.peso}`);
  $("#alianzasSH").html(`<strong>Alianzas:</strong> ${objeto.alianzas }`)

} 

function muestraError(error) {
mensaje = "A ocurrido Un error, Favor intente nuevamente "
alert(mensaje);
console.log(error);
}

/* -------------------------------------------------------------------- */
/* EVENTOS */
/* -------------------------------------------------------------------- */
$(document).ready(function () {
  $("#formulario").submit(function (event) {

    event.preventDefault();

    let id = $('#NumeroSuperHero').val();

    let validacion = validacionInput(id);

    if (validacion) {
      // Obtener referencia al div
      const div = document.getElementById("MainContainer");
      // Cambiar estilo para hacerlo visible
      div.style.display = "flex";
      consultaAPI(id); /* Si Input es exitoso Consulto datos */
    }
  });
});
