//Función para consultar todos los productos
function BusquedaProductosHome() {
  event.preventDefault();
  var busqueda = $('#txtBasicSearch').val();

  if (busqueda != "") {
    window.location = "Productos.html?name=" + busqueda;
  }
  else {
    MensajeGenericoIcono('Por favor introduce un valor', '', 'info', false, 'Ok');
  }
}

function resolveBasicRequest() {
  var byCategory = getParameterByName("cat");
  var byName = getParameterByName("name");

  var results;
  if (byCategory) {
    results = getProductsBy("category", byCategory, injectProducts);
  } else if (byName) {
    results = getProductsBy("name", byName, injectProducts);
  } else {
    results = getProductsBy(null, null, injectProducts);
  }
}

function injectProducts(results) {
  if (!results) {
    window.location = "ProductoNoEncontrado.html";
  }
  
  if (typeof document != 'undefined') {
    var productList = document.getElementById("productList");
    productList.innerHTML = results;
  }
}

function getProductsBy(filter, value, resultHandler) {
  const Productos = Parse.Object.extend('Product');
  const query = new Parse.Query(Productos);

  var title = "";
  if (filter) {
    query.matches(filter, "(?i).{0,}(" + value + ").{0,}")
    title = "* " + value + " *";
  } else {
    title = "Productos";
  }

  query.find().then((results) => {
    if (results.length > 0) {
      var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
      result += results.map(createProductItem).reduce(reduceList);
      resultHandler(result);
    }
    else {
      resultHandler(null);
    }
  }, (error) => {
    resultHandler(null);
  });
}

function createProductItem(value, index, array) {
  const imageUrl = encodeURI(value.attributes["photoUrl"]);

  const result = "<div id=\"producto_" + index + "\" class=\"col-sm-4\">" + 
    "<div class=\"product-image-wrapper\">" +
      "<div class=\"single-products\">" +
        "<div class=\"productinfo text-center\">" +
          "<img id=\"imgProducto_" + index + "\" " +
            "src=\"" + value.attributes["photoUrl"] + "\" alt=\"\" />" +
              "<h2 id=\"precioProducto_" + index + "\">" + FormatoMoneda(value.attributes["value"]) + "</h2>" +
              "<p id=\"nombreProducto_" + index + "\">" + value.attributes["name"] + "</p>" +
              "<p><a href=\"DetalleProducto.html?id="+ value.id + "\"><i class=\"fa fa-plus-square\"></i> Ver Especificaciones</a></p>" +
              /* "<a class=\"btn btn-default add-to-cart\" onclick=\"AgregarAlCarrito('" + 
                value["id"] + "', '" +
                value.attributes["name"] + "', '" +
                imageUrl + "', " +
                "1, " +
                value.attributes["value"] + ")\">" +
              "<i class=\"fa fa-shopping-cart\"></i> Agregar al Carrito</a>" + */
        "</div>" +
      "</div>" +
    "</div>" +
  "</div>\n"

  return result
}


//Función para filtrar productos por marca
function FiltrarProductosPorMarca(resultHandler) {
  event.preventDefault();
  var marca = $('#txtFiltroMarca').val();
 /*  marca = marca.charAt(0).toUpperCase() + marca.slice(1); */

  debugger;
  if (marca != "") {
    const Productos = Parse.Object.extend('Product');
    const query = new Parse.Query(Productos);

    query.fullText("trademark", marca, { caseSensitive: false });

    var title = marca + "...";

    query.find().then((results) => {
      if (results.length > 0) {
        var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
        result += results.map(createProductItem).reduce(reduceList);
        resultHandler(result);
      }
      else {
        MensajeGenericoIcono('Sin resultados', 'No se encontraron productos con la marca indicada', 'error', false, 'Ok');
      }
    }, (error) => {
      MensajeGenericoIcono('No se pudo realizar la consulta. Por favor intente nuevamente.', "Error: " + error.code + " " + error.message, 'error', false, 'Ok');
    });
  }
}

//Función para filtrar productos por rangp de Precio
function FiltrarProductosPorPrecio(resultHandler) {
  event.preventDefault();
  var rangoPrecio = $('#sl2').val().split(",");
  var minValue = parseInt(rangoPrecio[0]);
  var maxValue = parseInt(rangoPrecio[1]);

  if (rangoPrecio != "") {
    const Productos = Parse.Object.extend('Product');
    const queryMin = new Parse.Query(Productos);
    const queryMax = new Parse.Query(Productos);

    queryMin.greaterThanOrEqualTo("value", minValue);
    queryMax.lessThanOrEqualTo("value", maxValue);

    const query = Parse.Query.and(queryMin, queryMax);

    var title = "Valor entre COP $" + numberWithDots(minValue) + " Y $" + numberWithDots(maxValue);

    query.find().then((results) => {
      if (results.length > 0) {
        var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
        result += results.map(createProductItem).reduce(reduceList);
        resultHandler(result);
      }
      else {
        MensajeGenericoIcono('Sin resultados', 'No se encontraron productos en el rango indicado', 'error', false, 'Ok');
      }
    }, (error) => {
      MensajeGenericoIcono('No se pudo realizar la consulta. Por favor intente nuevamente.', "Error: " + error.code + " " + error.message, 'error', false, 'Ok');
    });
  }
}
