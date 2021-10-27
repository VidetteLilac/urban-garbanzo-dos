function mostrarPasswordLogin() {
    var pass = document.getElementById("txtContrasenaLogin");
    if (pass.type == "password") {
        pass.type = "text";
        $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
        pass.type = "password";
        $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}

//Función para Ingresar
function Login() {
    var usuario = $('#txtUsuarioEmail').val();
    var pass = $('#txtContrasenaLogin').val();
    debugger;
    // Create a new instance of the user class
    Parse.User.logIn(usuario, pass).then(function (user) {
        if (user.get("username") == 'admin@neotekk.com') {
            MensajeConRedireccion('Bienvenido Administrador', 'Administracion.html');
        }
        else {
            MensajeConRedireccion('Bienvenido ' + user.get("firstName"), 'Home.html');
        }
        sessionStorage.setItem('user', user.get("firstName"));
        sessionStorage.setItem('userId', user.id);
    }).catch(function (error) {
        if (error.code == 101) {
            MensajeGenericoIcono('Usuario o Contraseña incorrectos. Por favor verifica e intenta nuevamente.', '', 'error', false, 'Ok');
            console.log("Error: " + error.code + " " + error.message);
        }
        else if (error.code == 205) {
            MensajeGenericoIcono('Debes verificar tu correo electrónico para poder ingresar', 'Revisa tu bandeja de entrada', 'info', false, 'Ok');
            console.log("Error: " + error.code + " " + error.message);
        }
        else {
            MensajeGenericoIcono('El usuario no existe', 'Por favor Regístrate', 'error', false, 'Ok');
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

function MostrarResetPass() {
    event.preventDefault();
    var mostrar = document.getElementById('divResetPass');

    if (mostrar.style.display == "none") {
        mostrar.style.display = "block";
        document.getElementById('frmResetPass').reset();
    }
    else {
        mostrar.style.display = "none";
    }
}

//Función para enviar correo para reestablecer contraseña
function EnviarResetPass() {
    var email = $('#txtEmailResetPass').val();
    var user = Parse.User

        .requestPasswordReset(email).then(function () {
            MensajeGenericoIcono('Se ha enviado a tu correo electrónico la solicitud para reestablecer la contraseña', '', 'success', false, 'Ok');
            MostrarResetPass();
            LimpiarFormulario();
        }).catch(function (error) {
            MensajeGenericoIcono('Error enviando la solicitud de reestablecimiento.', "Error: " + error.code + " " + error.message, 'error', false, 'Ok');
            console.log("Error sending Password reset request: " + error.code + " " + error.message);
        });
}

//Función para cerrar sesión
$('#cerrarSesion').click(function (event) {
    event.preventDefault();
    CerrarSesion();
});

function CerrarSesion() {
    if (sessionStorage.getItem('user') != null) {
        Swal.fire({
            title: '¿Desea salir del sistema?',
            text: "",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.value) {
                window.location = "Login.html";
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("userId");
            }
        })
    }
    else {
        window.location = "Login.html";
    }
}

//Función para limpiar campos
function LimpiarFormulario() {
    document.getElementById("frmLogin").reset();
    document.getElementById("frmSignUp").reset();
    document.getElementById("frmResetPass").reset();
}