//Archivo que se encarga de las funcionalidades de nuestra interfaz de nuestros restaurantes guardados
//así como eliminar o visualizar nuestros restaurantes guardados.

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "ko") {
                window.location.href = "../loginPage/loginPage.html";
                return;
            }
            window.userId = data.usuario.id;
            cargarValoraciones(window.userId);
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
            window.location.href = "../loginPage/loginPage.html";
        });
});

function cargarValoraciones(userId) {
    peticion.accion = 'cargarValoraciones';
    peticion.userId = userId;

    postData('viewReviews.php', {data: peticion})
        .then(valoraciones => {
            let html = `

    <section class="modalAlert">
        <div class="modalContainerAlert">
            <h2>SPOON</h2>
            <p></p>
        </div>
    </section>

<header>
    <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
    <nav class="topnav">
        <a href="../mainPage/mainPage.html">Home</a>
        <a id="loginLink" href="../loginPage/loginPage.html" style="display: none;">Login</a>
        <a id="signupLink" href="../registerPage/registerPage.html" style="display: none;">Sign Up</a>
    </nav>
</header>
`;

            if (valoraciones.length === 0) {
                html += `
<div class="sinValoraciones">
    <h1>No tienes valoraciones hechas</h1>
</div>
                `;
            }

            html += `
<section id="valoraciones">
`;

            valoraciones.forEach(valoracion => {
                html += `
    <div class="valoracion">
        <h3>Restaurante: ${valoracion.nombre_restaurante}</h3>
        <div class="datosValoracion">
            <p>Valoración: ${valoracion.puntuacion}/5⭐</p>
            <p>Comentario: ${valoracion.comentario}</p>
        </div>
        <div class="buttonsValoracion">
            <button class="eliminarValoracion" id="${valoracion.id}">Eliminar Valoración</button>
        </div>
    </div>`;
            });

            html += `
</section>

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
</footer>
`;

            document.body.innerHTML = html;

            document.getElementById("valoraciones").addEventListener("click", function (event) {
                if (event.target.classList.contains("eliminarValoracion")) {
                    event.preventDefault();
                    const idValoracion = event.target.id;
                    eliminarValoracion(idValoracion);
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar reservas:", error);
        });
}

function eliminarValoracion(idValoracion) {
    peticion.accion = "eliminarValoracion";
    peticion.idValoracion = idValoracion

    postData("viewReviews.php", {data: peticion})
        .then(response => {
            mostrarModal("Valoración eliminada con éxito");
            setTimeout(() => {
                window.location.href = "../viewReviewsPage/viewReviewsPage.html";
            }, 3000);
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Ha ocurrido un error.");
            setTimeout(() => {
                window.location.href = "../viewReviewsPage/viewReviewsPage.html";
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