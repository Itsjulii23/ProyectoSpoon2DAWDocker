//Archivo js para la parte de la interfaz en donde se ven las reservas que ha realizado el usuario
//o poder eliminarlas

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "ko") {
                window.location.href = "../loginPage/loginPage.html";
                return;
            }
            console.log("Sesión iniciada como:", data.usuario);
            window.userId = data.usuario.id;
            selectReservas(window.userId);
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
            window.location.href = "../loginPage/loginPage.html";
        });
});

function selectReservas(userId) {
    peticion.accion = 'selectReservas';
    peticion.userId = userId;

    postData("bookingPage.php", {data: peticion})
        .then(reservas => {
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

            if (reservas.length === 0) {
                html += `
<div class="sinReservas">
    <h1>No tienes reservas hechas</h1>
</div>
                `;
            }

            html += `
<section id="reservas">
`;

            reservas.forEach(reserva => {
                html += `
    <div class="reserva">
        <h3>Restaurante: ${reserva.nombre_restaurante}</h3>
        <div class="datosReserva">
            <p>Fecha de la reserva: ${reserva.fecha_reserva}</p>
            <p>Hora de la reserva: ${reserva.hora_reserva}</p>
            <p>Número de personas: ${reserva.num_personas}</p>
            <p>Descuento en el restaurante: ${reserva.descuento}%</p>
        </div>
        <div class="buttonsReserva">
            <button class="eliminarReserva" id="${reserva.id}">Cancelar Reserva</button>
        </div>
    </div>
                `;
            });

            html += `
</section>

<footer>
    <nav class="nav">
        <a href="../mainPage/mainPage.html" class="nav__link">
            <i class="material-icons nav__icon">home</i>
            <span class="material-symbols-outlined">Inicio</span>
        </a>
        <a href="../bookingPage/bookingPage.html" class="nav__link nav__link--active">
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

            document.getElementById("reservas").addEventListener("click", function (event) {
                if (event.target.classList.contains("eliminarReserva")) {
                    event.preventDefault();
                    const idReserva = event.target.id;
                    eliminarReserva(idReserva);
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar reservas:", error);
        });
}


function eliminarReserva(idReserva) {
    peticion.accion = "deleteReserva";
    peticion.idReserva = idReserva;

    postData("bookingPage.php", {data: peticion})
        .then(() => {
            mostrarModal("Reserva Eliminada");
            setTimeout(() => {
                window.location.href = "../bookingPage/bookingPage.html";
            }, 3000);
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Ha ocurrido un error.");
            setTimeout(() => {
                window.location.href = "../bookingPage/bookingPage.html";
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