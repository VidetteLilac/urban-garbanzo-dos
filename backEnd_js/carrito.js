class KartProduct {
    id;
    name;
    qty;
    cost;
    total;
    image;
};

/// -- Carga y funciones comunes
//Cargar carrito. Función principalmente entendida para la vista Carrito.html.
function loadKart() {
    findExistingKart(buildShoppingKart, injectShoppingKart, null);
}

function mapTotals(value, index, array) {
    return parseFloat(value.attributes["totalCost"]);
}

function reduceToTotals(total, value, index, array) {
    const numericTotal = parseFloat(value);

    return total += numericTotal;
}

/// -- Funciones para Manejar ShoppingKart
//Función para agregar al carrito
function AgregarAlCarrito(productId, productName, imageUrl, qty, cost) {
    //Aquí va el código para agregar al Carrito
    var product = new KartProduct();
    product.id = productId;
    product.name = productName;
    product.qty = parseInt(qty);
    product.cost = parseFloat(cost);
    product.total = parseFloat(cost) * parseFloat(qty);
    product.image = imageUrl;
    findExistingKart(buildShoppingKart, injectShoppingKart, product);
}

//Mensaje de producto agregado al Carrito
function MensajeCarrito() {
    Swal.fire({
        title: 'Producto agregado al carrito',
        text: "",
        icon: 'success',
        showCancelButton: true,
        cancelButtonText: 'Continuar Comprando',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ir al Carrito'
    }).then((result) => {
        if (result.value) {
            window.location = 'Carrito.html';
        }
    })
}

// Busca el carrito válido para compra del usuario en sesión, si no existe, invoca el proceso de creación de carrito.
// Al final, en caso de exito, resuelve por medio de resolveFindingKart y hacia resolveKartBuilding.
function findExistingKart(resolveFindingKart, resolveKartBuilding, productToAdd) {
    const userId = getCurrentUserId();
    if (userId == null) {
        return;
    }

    const ShoppingKart = Parse.Object.extend('ShoppingKart');
    const query = new Parse.Query(ShoppingKart);
    query.equalTo("userId", userId);
    query.equalTo("sold", false);
    query.equalTo("cancelled", false);

    query.find().then((results) => {
        if (results.length > 0) {
            addNewProductToKart(results[0], resolveFindingKart, resolveKartBuilding, productToAdd);
        } else {
            createNewKart(resolveFindingKart, resolveKartBuilding, productToAdd);
        } 
    }, (error) => {
        MensajeGenericoIcono('Ocurrió un error inesperado. Por favor vuelva a intentar más tarde.', '', 'info', false, 'Ok');
    });
}

// Agrega un nuevo producto a carrito, y luego resuelve a resolveFindingKart y hacia resolveKartBuilding.
function addNewProductToKart(shoppingKart, resolveFindingKart, resolveKartBuilding, productToAdd) {
    if (productToAdd) {
        const KartProducts = Parse.Object.extend('KartProducts');
        const myNewObject = new KartProducts();

        myNewObject.set('productId', productToAdd.id);
        myNewObject.set('productName', productToAdd.name);
        myNewObject.set('image', productToAdd.image);
        myNewObject.set('quantity', productToAdd.qty);
        myNewObject.set('unitCost', productToAdd.cost);
        myNewObject.set('totalCost', productToAdd.total);
        myNewObject.set('kartId', shoppingKart["id"]);

        myNewObject.save().then(
        (result) => {
            resolveFindingKart(shoppingKart, resolveKartBuilding);

            //Mensaje de exito
            MensajeCarrito();
        },
        (error) => {
            MensajeGenericoIcono('Ocurrió un error inesperado. Por favor vuelva a intentar más tarde.', '', 'info', false, 'Ok');
        }
        );
    } else {
        resolveFindingKart(shoppingKart, resolveKartBuilding);
    }
}

// Crea un nuevo carrito en caso de que el usuario en sesión no tenga un carro válido para compra. 
// Luego vuelve a findExistingKart.
function createNewKart(resolveFindingKart, resolveKartBuilding, productToAdd) {
    const userId = getCurrentUserId();
    if (userId == null) {
        return;
    }

    const ShoppingKart = Parse.Object.extend('ShoppingKart');
    const myNewObject = new ShoppingKart();

    myNewObject.set('userId', userId);
    myNewObject.set('sold', false);
    myNewObject.set('cancelled', false);
    myNewObject.set('address', 'NOADDR');

    myNewObject.save().then(
    (result) => {
        findExistingKart(resolveFindingKart, resolveKartBuilding, productToAdd);
    },
    (error) => {
        MensajeGenericoIcono('Ocurrió un error inesperado. Por favor vuelva a intentar más tarde.', '', 'info', false, 'Ok');
    }
    );
}

// Función para responder a la resolución de hallar un carrito válido. 
// Esta función obtiene la lista de productos asociados a un carrito dado.
function buildShoppingKart(shoppingKart, resolveKartBuilding) {
    const KartProducts = Parse.Object.extend('KartProducts');
    const query = new Parse.Query(KartProducts);
    query.equalTo("kartId", shoppingKart["id"]);

    query.find().then((results) => {
        resolveKartBuilding(shoppingKart, results);
    }, (error) => {
        MensajeGenericoIcono('Ocurrió un error inesperado. Por favor vuelva a intentar más tarde.', '', 'info', false, 'Ok');
    });
}

// Función que inyecta la lista de productos de un carrito dado.
function injectShoppingKart(shoppingKart, kartProducts) {
    if (typeof document != 'undefined') {
        var kartId = document.getElementById("kartId");
        var productList = document.getElementById("kartProductsList");

        if (kartId == null || productList == null) {
            return;
        }

        var results = kartProducts.map(shoppingKartProductRow).reduce(reduceList);  

        kartId.value = shoppingKart["id"];
        productList.innerHTML = results;

        injectTotalsValues(kartProducts);
    }
}

function shoppingKartProductRow(value, index, array) {
    const numericCost = parseFloat(value.attributes["unitCost"]);
    const numericTotal = parseFloat(value.attributes["totalCost"]);

    const formattedCost = "COP $" + numberWithDots(numericCost);
    const formattedTotal = "COP $" + numberWithDots(numericTotal);

    var result = "<tr>" +
        "<td class=\"cart_product\">" +
            "<a href=\"\"><img id=\"kartProductImage\" src=\"" + value.attributes["image"] + "\" alt=\"\"" + 
                " style=\"width: auto; height: auto; max-width: 92px; max-height: 92px;\"" +
            "></a>" +
        "</td>" +
        "<td class=\"cart_description\">" +
            "<h4><a href=\"detalleProducto.html?id=" + value.attributes["productId"] + "\"><span id=\"kartProductName\">" + value.attributes["productName"] + "</span></a></h4>" +
            "<p>ID: <span id=\"kartProductId\">" + value.attributes["productId"] + "</span></p>" +
        "</td>" +
        "<td class=\"cart_price\">" +
            "<p id=\"kartProductCost\">" + formattedCost + "</p>" +
        "</td>" +
        "<td class=\"cart_quantity\">" +
            "<div class=\"cart_quantity_button\">" +
                "<input id=\"kartProductQty\" class=\"cart_quantity_input\" type=\"text\" name=\"quantity\" value=\"" + value.attributes["quantity"] + "\" autocomplete=\"off\" size=\"2\" disabled>" +
            "</div>" +
        "</td>" +
        "<td class=\"cart_total\">" +
            "<p id=\"kartProductTotal\" class=\"cart_total_price\">" + formattedTotal + "</p>" +
        "</td>" +
        "<td class=\"cart_delete\">" +
            "<a class=\"cart_quantity_delete\" href=\"\"><i class=\"fa fa-times\"></i></a>" +
        "</td>" +
    "</tr>";

    return result;
}

function injectTotalsValues(kartProducts) {
    const totals = kartProducts.map(mapTotals).reduce(reduceToTotals);
    const taxes = totals * 0.19;
    const grandTotal = totals + taxes;

    const formattedSubtotal = "COP $" + numberWithDots(totals);
    const formattedTaxes = "COP $" + numberWithDots(taxes);
    const formattedGrandtotal = "COP $" + numberWithDots(grandTotal);

    var kartSubtotal = document.getElementById("kartSubtotal");
    var kartTaxes = document.getElementById("kartTaxes");
    var kartGrandTotal = document.getElementById("kartGrandTotal");

    kartSubtotal.innerText = formattedSubtotal;
    kartTaxes.innerText = formattedTaxes;
    kartGrandTotal.innerText = formattedGrandtotal;
}


/// -- Funciones para gestionar compra
//Realizar El Pedido con el shoppingKart existente
function RealizarPedido() {
    event.preventDefault();

    const userId = getCurrentUserId();
    if (userId == null) {
        MensajeGenericoIcono('Debes iniciar Sesión', 'No puedes realizar pedidos', 'info', false, 'Ok');
        return;
    }

    var direccion = $('#txtDireccion').val();

    const citySelect = document.getElementById("kartCity"); 
    const selectedCity = citySelect.value;

    if (direccion != "" && selectedCity != "") {
        const kartId = document.getElementById("kartId");
        const address = direccion + " - " + selectedCity;
        performBuying(kartId.value, address);
    }
    else {
        MensajeGenericoIcono('Debe ingresar una dirección de envío y seleccionar una ciudad', '', 'info', false, 'Ok');
    }
}

function performBuying(kartId, address) {
    const ShoppingKart = Parse.Object.extend('ShoppingKart');
    const query = new Parse.Query(ShoppingKart);
    
    query.get(kartId).then((object) => {
        object.set('sold', true);
        object.set('cancelled', false);
        object.set('address', address);
        object.save().then((response) => {
            MensajeConRedireccion('Pedido realizado correctamente. Gracias por tu Compra', 'Home.html');
        }, (error) => {
            MensajeGenericoIcono('Ocurrió un error inesperado. Por favor vuelva a intentar más tarde.', '', 'info', false, 'Ok');
        });
    });
}
