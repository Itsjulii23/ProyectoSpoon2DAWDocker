//Archivo que se encarga de las funcionalidades de nuestra interfaz de las valoraciones del usuario.
//Asi como el envio del comentario y la valoracion del mismo a nuestro backend para que lo procese
//y haga las peticiones o consultas necesarias a nuestra base de datos.

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php", {credentials: "include"}) // <- Importantísimo
        .then(response => response.json())
        .then(data => {
            if (data.status === "ko") {
                window.location.href = "../loginPage/loginPage.html";
                return;
            }
            console.log("Sesión iniciada como:", data.usuario);
            window.userId = data.usuario.id;
            cargarHTML();
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
            window.location.href = "../loginPage/loginPage.html";
        });
});

function cargarHTML() {
    peticion.accion = 'selectRestauranteId';
    peticion.idRestaurante = new URLSearchParams(window.location.search).get('id');
    postData("reviews.php", {data: peticion})
        .then(restaurante => {
            let restauranteId = restaurante[0].id
            let html = '';
            html = `

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
        </nav>
    </header>
    <div class="main-container">
        <section class="reviewForm">
            <form>
                <h3 class="">Deja tu reseña en ${restaurante[0].nombre}</h3>
                <label>Valoración</label>
                <div class="stars">
                    <span class="star" data-value="1">&#9733;</span>
                    <span class="star" data-value="2">&#9733;</span>
                    <span class="star" data-value="3">&#9733;</span>
                    <span class="star" data-value="4">&#9733;</span>
                    <span class="star" data-value="5">&#9733;</span>
                </div>
                <label for="comentarioRestaurante">Comentario</label>
                <input type="text" id="comentarioRestaurante" required/>
                <button type="button" id="reviewBtn">Enviar Reseña</button>
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
    </footer>
    `;

            document.body.innerHTML = html;

            const stars = document.querySelectorAll(".star");
            stars.forEach(star => {
                star.addEventListener("click", () => selectStars(star));
            });
            document.getElementById('reviewBtn').addEventListener('click', () => insertarValoracion(restauranteId));

        })
        .catch(error => console.error("Error registrando reseña:", error));
}

function selectStars(selectedStar) {
    const selectedValue = selectedStar.getAttribute("data-value");
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
        star.classList.remove("selected");
        star.removeAttribute("id");
    });

    stars.forEach(star => {
        if (star.getAttribute("data-value") <= selectedValue) {
            star.classList.add("selected");
        }
    });

    const lastSelectedStar = document.querySelector(`.star[data-value="${selectedValue}"]`);
    if (lastSelectedStar) {
        lastSelectedStar.setAttribute("id", "last-selected");
    }
}

function insertarValoracion(restauranteId) {
    const puntuacionElem = document.getElementById("last-selected");
    if (!puntuacionElem) {
        mostrarModal("Por favor, selecciona una puntuación.");
        return;
    }

    const puntuacion = puntuacionElem.getAttribute("data-value");
    const comentario = document.getElementById('comentarioRestaurante').value.trim();
    if (!comentario) {
        mostrarModal("Por favor, escribe un comentario.");
        return;
    }
    peticion.accion = 'insertarReview';
    peticion.idRestaurante = restauranteId;
    peticion.puntuacion = puntuacion;
    peticion.comentario = comentario;
    peticion.idUser = window.userId;

    postData("reviews.php", {data: peticion})
        .then(response => {
            mostrarModal("Valoración realizada con éxito");
            setTimeout(() => {
                window.location.href = "../viewReviewsPage/viewReviewsPage.html";
            }, 3000);
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Ha ocurrido un error.");
            setTimeout(() => {
                window.location.href = "../mainPage/mainPage.html";
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