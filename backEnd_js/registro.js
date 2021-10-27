//Función utilizada para realizar el registro de un usuario nuevo
function signUp() {
    if (ConfirmarContraseña()) {
        // Create a new instance of the user class
         var user = new Parse.User();

        user.set("username", $('#txtEmail').val());
        user.set("email", $('#txtEmail').val());
        user.set("firstName", $('#txtUserName').val());
        user.set("lastName", $('#txtUserApellido').val());
        user.set("identificationType", $('#ddlTipoIdentificacion').val());
        user.set("identificationNumber", $('#txtNumeroIdentificacion').val());  
        user.set("password", $('#txtPassword').val());

        user.signUp().then(function (user) {
            MensajeGenericoIcono(user.get("firstName") + ' te has registrado correctamente','Ingresa con tu Usuario y Contraseña', 'success', false, 'Ok');           
        }).catch(function (error) {
            MensajeGenericoIcono('Error de registro. Por favor intentalo nuevamente', '', 'error', false, 'Ok');
            console.log("Error: " + error.code + " " + error.message);
        });
        debugger;
        LimpiarFormulario();
    }
    else {
        MensajeGenerico("Las contraseñas no coinciden. Por favor verifica e intenta nuevamente");
    }
}

function ConfirmarContraseña() {
    debugger;
    var pass1 = document.getElementById("txtPassword").value;
    var pass2 = document.getElementById("txtConfirmPass").value;

    if (pass1 != pass2) {
        MensajeGenerico("Las contraseñas no coinciden. Por favor verifique");
        return false;
    }
    else{
        return true;
    }
}

function mostrarPassword() {
    var pass = document.getElementById("txtPassword");
    var confirmPass = document.getElementById("txtConfirmPass");
    if (pass.type == "password") {
        pass.type = "text";
        confirmPass.type = "text";
        $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
        pass.type = "password";
        confirmPass.type = "password";
        $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}

function LimpiarFormulario(){
    document.getElementById("frmLogin").reset();
    document.getElementById("frmSignUp").reset();
    document.getElementById("frmResetPass").reset();
    mostrarPassword();
}