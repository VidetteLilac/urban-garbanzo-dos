$(document).ready(function () {
    FormatoValor();
    GetProducts(ResolveAdminProducts);
});

//Función para dar formato a moneda local (es-CO): Español Colombia 
function FormatoValor() {
    document.getElementById("txtValor").onkeyup = function () {
        var numero = this.value;
        if (isNaN(numero)) {
            document.getElementById("txtValor").value = numero.substring(0, numero.length - 1);
            return false;
        } else {
            document.getElementById("txtValor").value = numero;
            return true;
        }
    }

    document.getElementById("txtValorEdit").onkeyup = function () {
        var numero = this.value;
        if (isNaN(numero)) {
            document.getElementById("txtValorEdit").value = numero.substring(0, numero.length - 1);
            return false;
        } else {
            document.getElementById("txtValorEdit").value = numero;
            return true;
        }
    }

    document.getElementById("txtValor").onchange = function () {

        const formatoPesos = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        })

        document.getElementById("txtValor").value = formatoPesos.format(this.value);
    }

    document.getElementById("txtValorEdit").onchange = function () {

        const formatoPesos = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        })

        document.getElementById("txtValorEdit").value = formatoPesos.format(this.value);
    }
}

function MostrarRegistrarProducto() {
    var registrar = document.getElementById('divRegistrarProducto');
    var editar = document.getElementById('divEditarProducto');
    editar.style.display = "none";

    if (registrar.style.display == "none") {
        registrar.style.display = "block";
        document.getElementById('frmRegistrar').reset();
    } else {
        registrar.style.display = "none";
    }
}

function MostrarEditarProducto() {
    var editar = document.getElementById('divEditarProducto');
    var registrar = document.getElementById('divRegistrarProducto');
    registrar.style.display = "none";

    if (editar.style.display == "none") {
        editar.style.display = "block";
        document.getElementById('frmEditar').reset();
    } else {
        editar.style.display = "none";
    }
}

//Función para crear un producto nuevo
function RegistrarProducto() {
    if (sessionStorage.getItem('user') != null) {
        /* var producto = new Parse.Product(); */
        const Productos = Parse.Object.extend('Product');
        const producto = new Productos();

        var currency = $('#txtValor').val();
        var number = Number(currency.replace(/[^0-9\,-]+/g, ""));

        producto.set("name", $('#txtNomProducto').val());
        producto.set("reference", $('#txtReferencia').val());
        producto.set("trademark", $('#txtMarca').val());
        producto.set("description", $('#txtDescripcion').val());
        producto.set("specifications", $('#txtEspecificaciones').val());
        producto.set("value", number);
        producto.set("availability", parseInt($('#txtDisponibilidad').val()));
        producto.set("photoUrl", $('#txtUrlImagen').val());
        producto.set("category", $('#ddlCategorias').val());

        producto.save().then(function (producto) {
            MensajeGenericoIcono('El producto ' + producto.get("name") + ' se ha creado correctamente', '', 'success', false, 'Ok');
            LimpiarFormulario();
        }).catch(function (error) {
            MensajeGenericoIcono('Error registrando el Producto. Por favor inténtalo nuevamente', '', 'error', false, 'Ok');
            console.log("Error: " + error.code + " " + error.message);
        });
    } else {
        MensajeGenericoIcono('Debes iniciar sesión como Administrador', 'No puedes agregar Productos', 'info', false, 'Ok');
    }
}

//Función para cargar el Listado de Productos
function GetProducts(resultHandler) {
    const Productos = Parse.Object.extend('Product');
    const query = new Parse.Query(Productos);
    debugger;

    query.ascending("name");
    query.find().then((results) => {
        debugger;
        resultHandler(results, null);
    }, (error) => {
        resultHandler(null, error);
    });
}

function ResolveAdminProducts(results, error) {
    if (!error) {
        var listItems = "<option value=\"\">Seleccione un Producto...</option>";
        listItems += results.map(getProductsOptions).reduce(reduceList);

        if (typeof document != 'undefined') {
            var dropDown = document.getElementById("ddlProductos");

            dropDown.innerHTML = listItems;
        }
    }
}

function getProductsOptions(value, index, array) {
    debugger;
    var result = "\n<option value=\"" + value.id + "\">" + value.attributes["name"] + "</option>";
    return result;
}

//Cargar la información del Producto seleccionado de la lista
function SetDataByProductId() {
    var productId = $('#ddlProductos').val();
    const Productos = Parse.Object.extend('Product');
    const query = new Parse.Query(Productos);
    debugger;

    query.get(productId).then((product) => {
        document.getElementById("txtIdProductoEdit").value = productId;
        document.getElementById("txtNomProductoEdit").value = product.get("name");
        document.getElementById("ddlCategoriasEdit").value = product.attributes["category"];
        document.getElementById("txtReferenciaEdit").value = product.attributes["reference"];
        document.getElementById("txtMarcaEdit").value = product.attributes["trademark"];
        document.getElementById("txtDescripcionEdit").value = product.attributes["description"];
        document.getElementById("txtEspecificacionesEdit").value = product.attributes["specifications"];
        document.getElementById("txtValorEdit").value = product.attributes["value"];
        document.getElementById("txtDisponibilidadEdit").value = product.attributes["availability"];
        document.getElementById("txtUrlImagenEdit").value = product.attributes["photoUrl"];
    }).catch(function (error) {
        MensajeGenericoIcono('Error cargando la información del Producto. Por favor intentalo nuevamente', '', 'error', false, 'Ok');
        console.log("Error: " + error.code + " " + error.message);
    });
}

//Función para editar un producto
function ActualizarProducto() {
    if (sessionStorage.getItem('user') != null) {
        var productId = $('#txtIdProductoEdit').val();
        const Productos = Parse.Object.extend('Product');
        const query = new Parse.Query(Productos);

        var currency = $('#txtValorEdit').val();
        var number = Number(currency.replace(/[^0-9\,-]+/g, ""));
        debugger;
        query.get(productId).then((object) => {
            debugger;
            object.set('name', $('#txtNomProductoEdit').val());
            object.set('category', $('#ddlCategoriasEdit').val());
            object.set('reference', $('#txtReferenciaEdit').val());
            object.set('trademark', $('#txtMarcaEdit').val());
            object.set('description', $('#txtDescripcionEdit').val());
            object.set('specifications', $('#txtEspecificacionesEdit').val());
            object.set('value', number);
            object.set('availability', parseInt($('#txtDisponibilidadEdit').val()));
            object.set('photoUrl', $('#txtUrlImagenEdit').val());
            debugger;
            object.save().then((response) => {
                debugger;
                MensajeGenericoIcono('El producto ' + object.get("name") + ' se ha actualizado correctamente', '', 'success', false, 'Ok');
                GetProducts(ResolveAdminProducts);
                LimpiarFormulario();
            }, (error) => {
                MensajeGenericoIcono('Error actualizando el Producto. Por favor intentalo nuevamente', '', 'error', false, 'Ok');
                console.log("Error: " + error.code + " " + error.message);
            });
        });
    } else {
        MensajeGenericoIcono('Debes iniciar sesión como Administrador', 'No puedes editar Productos', 'info', false, 'Ok');
    }
}

//Función para eliminar un producto
function EliminarProducto() {
    var productId = $('#ddlProductos').val();

    if (sessionStorage.getItem('user') != null) {
        debugger;
        if (productId == "") {
            MensajeGenericoIcono('Debe seleccionar un Producto', '', 'info', false, 'Ok');
        } else {
            var productId = $('#txtIdProductoEdit').val();
            const Productos = Parse.Object.extend('Product');
            const query = new Parse.Query(Productos);
            debugger;

            Swal.fire({
                title: '¿Esta seguro de eliminar el Producto seleccionado?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.value) {
                    query.get(productId).then((object) => {
                        object.destroy().then((response) => {
                            MensajeGenericoIcono('El producto se ha eliminado correctamente', '', 'success', false, 'Ok');
                            GetProducts(ResolveAdminProducts);
                            LimpiarFormulario();
                        }, (error) => {
                            MensajeGenericoIcono('Error eliminando el Producto. Por favor intentalo nuevamente', '', 'error', false, 'Ok');
                            console.log("Error: " + error.code + " " + error.message);
                        });
                    });
                }
            })
        }
    } else {
        MensajeGenericoIcono('Debes iniciar sesión como Administrador', 'No puedes eliminar Productos', 'info', false, 'Ok');
    }
}

//Función para limpiar campos
function LimpiarFormulario() {
    document.getElementById("frmRegistrar").reset();
    document.getElementById("frmEditar").reset();
}