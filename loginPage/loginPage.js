//Archivo que se encarga de las funcionalidades de la interfaz del inicio de sesion
//se encarga de mandar los datos de inicio de sesion y hacer una solicitud a nuestro archivo session
//que se encarga de crear la sesion.

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            const isLoggedIn = data.status === "ok";
            cargarHTML(isLoggedIn);
        })
        .catch(error => {
            console.error("Error al obtener sesión:", error);
            cargarHTML(false);
        });
});

function cargarHTML(isLoggedIn) {
    let html = `

    <section class="modalAlert">
        <div class="modalContainerAlert">
            <h2>SPOON</h2>
            <p></p>
        </div>
    </section>

    <header>
        <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
        <nav class="topnav">`;

    html += `<a href="../mainPage/mainPage.html">Home</a>`;

    if (!isLoggedIn) {
        html += `
            <a class="active" id="loginLink" href="../loginPage/loginPage.html">Login</a>
            <a id="signupLink" href="../registerPage/registerPage.html">Sign Up</a>`;
    }

    html += `</nav>
    </header>

    <div class="main-container">
        <section class="loginForm">
            <form>
                <h3>Inicia Sesión</h3>
                <label for="logEmail">Email</label>
                <input type="text" id="logEmail" name="logEmail" autocomplete="username" required/>
                <label for="logPassword">Contraseña</label>
                <input type="password" id="logPassword" name="logPassword" autocomplete="current-password" required/>
                <button type="button" id="btnLogin">Inicia Sesión</button>
            </form>
        </section>
    </div>

    <footer>
        <nav class="nav">
            <a href="../mainPage/mainPage.html" class="nav__link">
                <i class="material-icons nav__icon">home</i>
                <span class="material-symbols-outlined">Inicio</span>
            </a>
            <a href="../bookingPage/bookingPage.html" class="nav__link">
                <i class="material-icons nav__icon">book</i>
                <span class="material-symbols-outlined">Reservas</span>
            </a>
            <a href="../ProfilePage/profilePage.html" class="nav__link">
                <i class="material-icons nav__icon">person</i>
                <span class="material-symbols-outlined">Perfil</span>
            </a>
        </nav>
    </footer>`;

    document.body.innerHTML = html;
    const loginButton = document.getElementById("btnLogin");
    if (loginButton) {
        loginButton.addEventListener("click", inicioSesion);
    }
}

function inicioSesion(event) {
    event.preventDefault();
    const logEmail = document.getElementById("logEmail").value;
    const logPassword = document.getElementById("logPassword").value;

    if (!logEmail || !logPassword) {
        mostrarModal("Rellene todos los campos");
        return;
    }

    peticion.accion = "login";
    peticion.email = logEmail;
    peticion.password = logPassword;

    postData("loginPage.php", {data: peticion})
        .then((response) => {
            if (response.status === "ok") {
                mostrarModal("Has iniciado sesión con éxito.");
                setTimeout(() => {
                    window.location.href = "../ProfilePage/profilePage.html";
                }, 3000);
            } else {
                mostrarModal("Credenciales inválidas");
                setTimeout(() => {
                    window.location.href = "loginPage.html";
                }, 3000);
            }
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Error en la solicitud, intente más tarde.");
            setTimeout(() => {
                window.location.href = "../ProfilePage/profilePage.html";
            }, 3000);
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