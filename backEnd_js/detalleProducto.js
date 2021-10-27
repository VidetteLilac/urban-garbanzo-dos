function resolveLoadDetail() {
    var objectId = getParameterByName("id");

    if (objectId) {
        CargarDetallesProducto(objectId, injectProductDetails);
    }
}

//Función para cargar los datos del Producto para mostrar el detalle
function CargarDetallesProducto(objectId, resultHandler) {
    event.preventDefault();
    //Aquí va el código para enviar los datos y visualizar el detalle del producto
  
    const Productos = Parse.Object.extend('Product');
    const query = new Parse.Query(Productos);
  
    /* query.equalTo("value", 1); PENDIENTE*/
    query.equalTo("objectId", objectId);
  
    query.find().then((results) => {
      if (results.length > 0) {
        var result = results[0];
        resultHandler(result);
      }
      else {
        resultHandler(null);
      }
    }, (error) => {
      resultHandler(null);
    });
  }
  
function injectProductDetails(result) {
  if (typeof document != 'undefined') {
    var productId = document.getElementById("productId");
    var picture = document.getElementById("detailPicture");
    var name = document.getElementById("detailName");
    var reference = document.getElementById("detailReference");
    var detailNumericCost = document.getElementById("detailNumericCost");
    var formattedValue = document.getElementById("detailValue");
    var available = document.getElementById("detailAvailable");
    /* var addToKart = document.getElementById("detailAddToKart"); */
    var quantity = document.getElementById("detailQuantity");
    var trademark = document.getElementById("detailTrademark");
    var formattedDescription = document.getElementById("detailDescription");
    var formattedSpecifications = document.getElementById("detailSpecifications");
    
    var numericValue = parseFloat(result.attributes["value"]);
    
    productId.value = result.id;
    picture.src = result.attributes["photoUrl"];
    name.innerText = result.attributes["name"];
    reference.innerText = result.attributes["reference"];
    detailNumericCost.value = numericValue;
    formattedValue.innerText = "COP $" + numberWithDots(numericValue);
    available.value = result.attributes["availability"];
    quantity.innerText = result.attributes["availability"];
    trademark.innerText = result.attributes["trademark"];

    formattedDescription.innerHTML = result.attributes["description"];
    formattedSpecifications.innerHTML = result.attributes["specifications"];

    /* addToKart.innerHTML = "<button type=\"button\" class=\"btn btn-default cart\" onclick=\"invokeAddToKart()\">" +
      "<i class=\"fa fa-shopping-cart\"></i> Agregar Al Carrito</button>"; */
  }
}
  
function invokeAddToKart() {
  var productId = document.getElementById("productId");
  var picture = document.getElementById("detailPicture");
  var name = document.getElementById("detailName");
  var detailNumericCost = document.getElementById("detailNumericCost");
  var quantity = document.getElementById("cantidad");

  AgregarAlCarrito(productId.value, name.innerText, picture.src, quantity.value, detailNumericCost.value);
}

/* Para cantidad de unidades */
// se crea la función y se agrega al evento onclick en la etiqueta button con id aumentar
function aumentar() { 
    event.preventDefault();
    var cantidadStr = document.getElementById('cantidad').value;
    var cantidad = parseInt(cantidadStr);
    var availableStr = document.getElementById("detailAvailable").value;
    var available = parseInt(availableStr);

    if (cantidad < available) {
        document.getElementById('cantidad').value = ++cantidad; //se obtiene el valor del input, y se incrementa en 1 el valor que tenga.
    }
}

function disminuir() { 
    event.preventDefault();  
    var cantidadStr = document.getElementById('cantidad').value;
    var cantidad = parseInt(cantidadStr);

    if(cantidad > 1)
    {
        document.getElementById('cantidad').value = --cantidad; 
    }
}
