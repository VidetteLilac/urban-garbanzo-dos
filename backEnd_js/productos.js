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
  var title = "";
  const allProducts = getAllProducts();
  var filtered = allProducts;
  if (filter) {
    title = "* " + value + " *";
    filtered = allProducts.filter(function(item) {
      return item[filter].indexOf(value) !== -1;
     });
  }

  if (filtered.length > 0) {
    var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
    result += filtered.map(createProductItem).reduce(reduceList);
    resultHandler(result);
  } else {
    resultHandler(null);
  }
}

function createProductItem(value, index, array) {
  const imageUrl = encodeURI(value["photoUrl"]);

  const result = "<div id=\"producto_" + index + "\" class=\"col-sm-4\">" + 
    "<div class=\"product-image-wrapper\">" +
      "<div class=\"single-products\">" +
        "<div class=\"productinfo text-center\">" +
          "<img id=\"imgProducto_" + index + "\" " +
            "src=\"" + value["photoUrl"] + "\" alt=\"\" />" +
              "<h2 id=\"precioProducto_" + index + "\">" + FormatoMoneda(value["value"]) + "</h2>" +
              "<p id=\"nombreProducto_" + index + "\">" + value["name"] + "</p>" +
              "<p><a href=\"DetalleProducto.html?id="+ value["objectId"] + "\"><i class=\"fa fa-plus-square\"></i> Ver Especificaciones</a></p>" +
        "</div>" +
      "</div>" +
    "</div>" +
  "</div>\n"

  return result
}

function filterByTrademark() {
  FiltrarProductosPorMarca(injectProducts);
}

function filterByPriceRange() {
  FiltrarProductosPorPrecio(injectProducts);
}

//Función para filtrar productos por marca
function FiltrarProductosPorMarca(resultHandler) {
  event.preventDefault();
  var marca = $('#txtFiltroMarca').val();
 /*  marca = marca.charAt(0).toUpperCase() + marca.slice(1); */

  debugger;

  if (marca != "") {
    const allProducts = getAllProducts();
    var filtered = allProducts.filter(function(item) {
      return item["trademark"].toUpperCase() === marca.toUpperCase();
    });

    var title = marca + "...";

    if (filtered.length > 0) {
      var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
      result += filtered.map(createProductItem).reduce(reduceList);
      resultHandler(result);
    } else {
      MensajeGenericoIcono('Sin resultados', 'No se encontraron productos con la marca indicada', 'error', false, 'Ok');
    }
  }

  
}

//Función para filtrar productos por rangp de Precio
function FiltrarProductosPorPrecio(resultHandler) {
  event.preventDefault();
  var rangoPrecio = $('#sl2').val().split(",");
  var minValue = parseInt(rangoPrecio[0]);
  var maxValue = parseInt(rangoPrecio[1]);

  if (rangoPrecio != "") {
    const allProducts = getAllProducts();
    var filtered = allProducts.filter(function(item) {
      const price = parseInt(item["value"]);
      return (price >= minValue && price <= maxValue);
    });

    var title = "Valor entre COP $" + numberWithDots(minValue) + " Y $" + numberWithDots(maxValue);

    if (filtered.length > 0) {
      var result = "<h2 class=\"title text-center\">" + title + "</h2>\n";
      result += filtered.map(createProductItem).reduce(reduceList);
      resultHandler(result);
    } else {
      MensajeGenericoIcono('Sin resultados', 'No se encontraron productos en el rango indicado', 'error', false, 'Ok');
    }

  }
}
