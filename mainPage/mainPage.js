//Se encarga de dar funcionalidades a nuestra interfaz de la pagina principal
//asi como ver las reseñas de los restaurantes cargar un mapa interactivo con los restaurantes de nuestra aplicacion.

let peticion = {};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            const isLoggedIn = data.status === "ok";
            window.isLoggedIn = isLoggedIn;
            if (isLoggedIn) {
                window.userId = data.usuario.id;
            }
            cargarHtml(isLoggedIn);
            setTimeout(() => {
                cargarCategorias();
                cargarRestaurantesMapa();
                cargarRestaurantes();
                cambiarCategorias();
            }, 100);
        })
        .catch(error => {
            console.error("Error al obtener sesión:", error);
            cargarHtml(false);
            setTimeout(() => {
                cargarCategorias();
                cargarRestaurantesMapa();
                cargarRestaurantes();
                cambiarCategorias();
            }, 100);
        });
});


function cargarHtml(isLoggedIn) {
    let html = '';
    html = `

<section class="modal">
        <div class="modalContainer">
        </div>
</section>

    <section class="modalAlert">
        <div class="modalContainerAlert">
            <h2>SPOON</h2>
            <p></p>
        </div>
    </section>
    
    <header>
        <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
        <nav class="topnav">`;

    html += `<a class="active" href="../mainPage/mainPage.html">Home</a>`;

    if (!isLoggedIn) {
        html += `
            <a id="loginLink" href="../loginPage/loginPage.html">Login</a>
            <a id="signupLink" href="../registerPage/registerPage.html">Sign Up</a>`;
    }

    html += `</nav>
    </header>`

    html += `<section class="home_img">
    <div class="welcome">
        <h1>BIENVENIDO A SPOON</h1>
        <p>Aquí puedes hacer tus reservas a tus restaurantes favoritos</p>
    </div>
</section>

<section class="filterRestaurant">
    <div class="categoriesDiv">
        <h1>Seleccione tu tipo de comida favorito</h1>
        <select id="selectRestaurant"></select>
    </div>
</section>

<div id="idMapa"></div>

<section id="restaurantes" class="restaurantes"></section>

<footer>
    <nav class="nav">
        <a href="../mainPage/mainPage.html" class="nav__link nav__link--active">
            <i class="material-icons nav__icon">home</i>
            <span>Inicio</span>
        </a>
        <a href="../bookingPage/bookingPage.html" class="nav__link">
            <i class="material-icons nav__icon">book</i>
            <span>Reservas</span>
        </a>
        <a href="../ProfilePage/profilePage.html" class="nav__link">
            <i class="material-icons nav__icon">person</i>
            <span>Perfil</span>
        </a>
    </nav>
</footer>`;
    document.body.innerHTML = html;
}

function cargarCategorias() {
    peticion.accion = 'cargarCategorias';
    postData("restaurantes.php", {data: peticion}).then((categoria) => {
        let html = '<option id="all" selected>Todos</option>';
        for (let k in categoria) {
            html += `<option id="${categoria[k].id}">${categoria[k].nombre}</option>`;
        }
        document.getElementById("selectRestaurant").innerHTML = html;
    });
}

let mymap;
let markerLayer = L.layerGroup();

function cargarRestaurantesMapa() {
    mymap = L.map('idMapa').setView([36.7194715, -4.4232446], 16);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data © OpenStreetMap contributors, Imagery © Mapbox',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoieW9xdWVzZTEiLCJhIjoiY2xhczQ0cm00MGFhczQwbjRmMGViOWVxcyJ9.jviq3jRB10txjzsDnCcsRA'
    }).addTo(mymap);

    markerLayer.addTo(mymap);

    peticion.accion = 'cargarRestaurantesMap';
    postData("restaurantes.php", {data: peticion}).then((restaurante) => {
        for (let k in restaurante) {
            let lat = restaurante[k].latitud;
            let lon = restaurante[k].longitud;
            L.marker([lat, lon]).addTo(markerLayer)
                .bindPopup(`<div class="popUp">
                    <div class="popOutData">
                        <b>${restaurante[k].nombre}</b>
                        <img src="../${restaurante[k].img}" alt="popOutPhoto">
                    </div>
                        <div class="popOutBtn">
                    <button class="bookBtn" onclick="window.location.href='../bookPage/bookPage.html?id=${restaurante[k].id}'">Reservar</button>
                    <button class="viewReviewBtn" data-id="${restaurante[k].id}">Ver Reseñas</button>
                    <button class="reviewBtn" onclick="window.location.href='../reviewsPage/reviewPage.html?id=${restaurante[k].id}'">Hacer Reseña</button>
                        </div>
                    </div>`);
        }
    });
}

function cargarRestaurantes() {
    peticion.accion = 'cargarRestaurantes';
    postData("restaurantes.php", {data: peticion}).then((restaurante) => {
        let html = '';
        for (let k in restaurante) {
            html += `
<div class="restaurante">
    <h3>
        ${restaurante[k].nombre}
        ${window.isLoggedIn ? `<span class="saveRestaurant" id="${restaurante[k].id}"><i class="material-icons">menu_book</i></span>` : ''}
    </h3>
    <p>${restaurante[k].descripcion}</p>
    <img class="restauranteImg" src="../${restaurante[k].img}" alt="restaurante">
    <div class="buttonsMain">
        <button onclick="window.location.href='../bookPage/bookPage.html?id=${restaurante[k].id}'">Reservar</button>
        <button class="viewReviewBtn" id="${restaurante[k].id}">Ver Reseñas</button>
        <button onclick="window.location.href='../reviewsPage/reviewPage.html?id=${restaurante[k].id}'">Hacer Reseña</button>
    </div>
</div>`;
        }
        document.getElementById("restaurantes").innerHTML = html;
    });
}

function cambiarCategorias() {
    const selectCategoria = document.getElementById('selectRestaurant');
    selectCategoria.addEventListener('change', function () {
        const opcionSeleccionada = selectCategoria.options[selectCategoria.selectedIndex];
        if (opcionSeleccionada.id === 'all') {
            peticion.accion = 'cargarRestaurantes';
        } else {
            peticion.accion = 'changeRestaurant';
            peticion.idCategoria = opcionSeleccionada.id;
        }

        postData('restaurantes.php', {data: peticion}).then((restaurante) => {
            let html = '';
            markerLayer.clearLayers();
            for (let k in restaurante) {
                let lat = restaurante[k].latitud;
                let lon = restaurante[k].longitud;
                L.marker([lat, lon]).addTo(markerLayer)
                    .bindPopup(`<div class="popUp"><b>${restaurante[k].nombre}</b>
                        <button onclick="window.location.href='../bookPage/bookPage.html?id=${restaurante[k].id}'">Reservar</button>
                        <button class="viewReviewBtn" data-id="${restaurante[k].id}">Ver Reseñas</button>
                        <button onclick="window.location.href='../reviewsPage/reviewPage.html?id=${restaurante[k].id}'">Hacer Reseña</button>
                    </div>`);
            }
            for (let k in restaurante) {
                html += `
<div class="restaurante">
    <h3>
        ${restaurante[k].nombre}
        ${window.isLoggedIn ? `<span class="saveRestaurant" id="${restaurante[k].id}"><i class="material-icons">menu_book</i></span>` : ''}
    </h3>
    <p>${restaurante[k].descripcion}</p>
    <img class="restauranteImg" src="../${restaurante[k].img}" alt="Restaurante">
    <div class="buttonsMain">
        <button onclick="window.location.href='../bookPage/bookPage.html?id=${restaurante[k].id}'">Reservar</button>
        <button class="viewReviewBtn" data-id="${restaurante[k].id}">Ver Reseñas</button>
        <button onclick="window.location.href='../reviewsPage/reviewPage.html?id=${restaurante[k].id}'">Hacer Reseña</button>
    </div>
</div>`;
            }

            document.getElementById("restaurantes").innerHTML = html;
        });
    });
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("viewReviewBtn")) {
        peticion.accion = 'loadModalReview';
        peticion.idRestaurante = event.target.id || event.target.dataset.id;
        postData("restaurantes.php", {data: peticion}).then((reviewsdata) => {
            mostrarModalValoraciones(reviewsdata);
            setTimeout(() => {
            }, 3000);
        })
            .catch((error) => {
                console.error("Error en la solicitud:", error);
                mostrarModalValoraciones("Error en la solicitud, intente más tarde.");
            });
    }
});

function mostrarModalValoraciones(reviewsdata) {
    const modal = document.querySelector(".modal");
    const modalContainer = document.querySelector(".modalContainer");

    modalContainer.innerHTML = "";

    const closeModalBtn = document.createElement("span");
    closeModalBtn.classList.add("closeModal");
    closeModalBtn.textContent = "X";
    modalContainer.appendChild(closeModalBtn);

    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("modalShow");
        document.body.classList.remove('modalActive');
    });

    if (reviewsdata.length > 0) {
        const restauranteNombre = document.createElement("h1");
        restauranteNombre.textContent = reviewsdata[0].restaurante_nombre;
        modalContainer.appendChild(restauranteNombre);

        reviewsdata.forEach(review => {
            const reviewDiv = document.createElement("div");
            reviewDiv.classList.add("review");
            reviewDiv.innerHTML = `
                <h3>${review.usuario_nombre}</h3>
                <p>${review.comentario}</p>
                <p>${review.puntuacion}/5</p>
            `;
            modalContainer.appendChild(reviewDiv);
        });
    } else {
        const reviewDiv = document.createElement("div");
        reviewDiv.innerHTML = `
            <h3>No hay ninguna reseña de este restaurante</h3>
        `;
        modalContainer.appendChild(reviewDiv);
    }
    modal.classList.add("modalShow");
    document.body.classList.add('modalActive');
}


document.addEventListener("click", function (event) {
    if (event.target.closest(".saveRestaurant")) {
        const idRestaurante = event.target.closest(".saveRestaurant").id;
        peticion.accion = 'guardarRestaurante';
        peticion.idUser = window.userId;
        peticion.idRestaurante = idRestaurante;
        postData("restaurantes.php", {data: peticion}).then((response) => {
            console.log(response);
            if (response.status === 'exists') {
                mostrarModal("Este restaurante ya está en tus favoritos.");
            } else if (response.status === 'ok') {
                mostrarModal("Restaurante guardado con éxito!");
                setTimeout(() => {
                    window.location.href = "../favPage/favPage.html";
                }, 3000);
            }
        });

    }
});

function mostrarModal(mensaje) {
    const modal = document.querySelector(".modalAlert");
    const textModal = document.querySelector(".modalAlert p");
    textModal.innerHTML = mensaje;
    modal.classList.add("modalShow");
    setTimeout(() => {
        modal.classList.remove("modalShow")
    }, 3000);
}