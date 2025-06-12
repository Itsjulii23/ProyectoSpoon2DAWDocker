//Archivo que se dedica de dar funcionalidades a nuestra interfaz de registro asi como mandar los
//datos del registro a nuestro backend para que los procese.

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                window.location.href = "../ProfilePage/profilePage.html";
            } else {
                console.log("Sesión no iniciada");
                cargarHTML();
                document.getElementById("btnReservar").addEventListener("click", registro);
            }
        })
        .catch(error => {
            console.error("Error al verificar sesión:", error);
            window.location.href = "../loginPage/loginPage.html";
        });
});

function cargarHTML() {
    let html = `
<header>
    <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
    <nav class="topnav">
        <a href="../mainPage/mainPage.html">Home</a>
        <a id="loginLink" href="../loginPage/loginPage.html">Login</a>
        <a class="active" id="signupLink" href="../registerPage/registerPage.html">Sign Up</a>
    </nav>
</header>

<section class="modalAlert">
    <div class="modalContainerAlert">
        <h2>SPOON</h2>
        <p></p>
    </div>
</section>

<div class="main-container">
    <section class="registerForm">
        <form>
            <h3>Registrate</h3>
            <div class="form-row">
                <label for="regUser">Usuario</label>
                <input type="text" id="regUser" name="regUser" required/>
            </div>
            <div class="form-row">
                <label for="regEmail">Email</label>
                <input type="email" id="regEmail" name="regEmail" autocomplete="username" required/>
            </div>
            <div class="form-row">
                <label for="regBirthdate">Fecha de nacimiento</label>
                <input type="date" min="1900-01-01" max="2025-12-31" id="regBirthdate" name="regBirthdate" required/>
            </div>
            <div class="form-row">
                <label for="regPass">Contraseña</label>
                <input type="password" id="regPass" name="regPass" autocomplete="new-password" required/>
            </div>
            <div class="form-row">
                <label for="regPassConf">Confirmar Contraseña</label>
                <input type="password" id="regPassConf" name="regPassConf" autocomplete="new-password" required/>
            </div>
            <button type="button" id="btnReservar">Registrate</button>
        </form>
    </section>
</div>

<footer>
    <nav class="nav">
        <a href="../mainPage/mainPage.html" class="nav__link">
            <i class="material-icons nav__icon">home</i>
            <span class="material-symbols-outlined">
            Inicio
        </span>
        </a>
        <a href="../bookingPage/bookingPage.html" class="nav__link">
            <i class="material-icons nav__icon">book</i>
            <span class="material-symbols-outlined">
            Reservas
        </span>
        </a>
        <a href="../ProfilePage/profilePage.html" class="nav__link">
            <i class="material-icons nav__icon">person</i>
            <span class="material-symbols-outlined">
            Perfil
        </span>
        </a>
    </nav>
</footer>`

    document.body.innerHTML = html;
}

function registro(event) {
    event.preventDefault();
    const registroUser = document.getElementById("regUser").value.trim();
    const registroEmail = document.getElementById("regEmail").value.trim();
    const registroBirthdate = document.getElementById("regBirthdate").value.trim();
    const registroPassword = document.getElementById("regPass").value.trim();
    const registroPasswordConf = document.getElementById("regPassConf").value.trim();

    if (!registroEmail || !registroPassword || !registroPasswordConf || !registroUser || !registroBirthdate) {
        mostrarModal("Rellene todos los campos");
        return;
    }
    if (registroPassword !== registroPasswordConf) {
        mostrarModal("Las contraseñas no coinciden");
        return;
    }
    peticion.user = registroUser;
    peticion.email = registroEmail;
    peticion.password = registroPassword;
    peticion.birthdate = registroBirthdate;

    postData("registro.php", {data: peticion})
        .then((response) => {
            if (response.status === "success") {
                mostrarModal(response.message);
                setTimeout(() => {
                    window.location.href = "../ProfilePage/profilePage.html";
                }, 3000);
            } else if (response.status === "error") {
                mostrarModal(response.message);
            } else {
                mostrarModal("Respuesta desconocida del servidor.");
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Error en la solicitud, intente más tarde.");
        });

}

function mostrarModal(mensaje) {
    const modal = document.querySelector(".modalAlert");
    const textModal = document.querySelector(".modalAlert p");

    textModal.innerHTML = mensaje;
    modal.classList.add("modalShow");

    setTimeout(() => {
        modal.classList.remove("modalShow")
    }, 3000);
}