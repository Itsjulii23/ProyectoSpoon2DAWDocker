//Archivo que se encarga de las funcionalidades de la interfaz del restaurante en donde
//hacemos la reserva como escoger la hora el dia o el numero de persona

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
            cargarHTML();
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
        });
});

function cargarHTML() {
    const restauranteId = new URLSearchParams(window.location.search).get('id');
    peticion.accion = 'selectRestauranteId';
    peticion.restauranteId = restauranteId;

    postData("reservas.php", {data: peticion})
        .then(response => {
            let html = `
<header>
    <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
    <nav class="topnav">
        <a href="../mainPage/mainPage.html">Home</a>
    </nav>
</header>

<section class="modalAlert">
    <div class="modalContainerAlert">
        <h2>SPOON</h2>
        <p></p>
    </div>
</section>

<div class="main-container">
    <section class="bookForm">
        <form>
            <h3 class="">Haz tu reserva en: ${response[0].nombre}</h3>
            <label for="fechaReserva">Date</label>
            <input type="date" id="fechaReserva" name="fechaReserva" required/>
            <label for="horaReserva">Hora</label>
            <select id="horaReserva" name="horaReserva" required>
                <option value="">Selecciona una hora</option>
            </select>
            <label for="numPersonas">Número de Personas</label>
            <input type="number" id="numPersonas" name="numPersonas" required/>
            <button type="button" id="reservarBtn">Reservar</button>
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
        <a href="../ProfilePage/profilePage.html" class="nav__link nav__link--active">
            <i class="material-icons nav__icon">person</i>
            <span class="material-symbols-outlined">Perfil</span>
        </a>
    </nav>
</footer>
            `;

            document.body.innerHTML = html;

            const inputFecha = document.getElementById('fechaReserva');
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const minDate = `${yyyy}-${mm}-${dd}`;
            inputFecha.setAttribute("min", minDate);

            document.getElementById('reservarBtn').addEventListener('click', function (event) {
                insertarReserva(event, restauranteId);
            });

            document.getElementById('fechaReserva').addEventListener('change', function (event) {
                selecthours(event);
            });
        })
        .catch(error => console.error("Error cargando restaurante:", error));
}


function selecthours(event) {
    event.preventDefault();
    const idRestaurante = new URLSearchParams(window.location.search).get('id');
    const fechaSeleccionada = document.getElementById('fechaReserva').value;

    if (!fechaSeleccionada) {
        mostrarModal("Por favor, selecciona una fecha para ver las horas disponibles.");
        return;
    }

    peticion.accion = 'selectHours';
    peticion.day = fechaSeleccionada;
    peticion.idRestaurante = idRestaurante;

    postData("reservas.php", {data: peticion})
        .then((response) => {
            console.log("Reservas por hora:", response);
            const todasLasHoras = generarHorasDisponibles();
            const horasDisponibles = todasLasHoras.filter(hora => {
                const reserva = response.find(res => res.hora_reserva.substring(0, 5) === hora);
                return !reserva || reserva.total < 2;
            });
            actualizarSelectHoras(horasDisponibles);
        })
        .catch(error => console.error("Error consultando horas:", error));
}


function generarHorasDisponibles() {
    const horas = [];
    const agregarHoras = (inicio, fin) => {
        let horaActual = new Date(`1970-01-01T${inicio}:00`);
        const horaFin = new Date(`1970-01-01T${fin}:00`);
        while (horaActual <= horaFin) {
            const hora = horaActual.toTimeString().substring(0, 5);
            horas.push(hora);
            horaActual.setMinutes(horaActual.getMinutes() + 15);
        }
    };
    agregarHoras("12:00", "16:00");
    agregarHoras("20:00", "23:00");
    return horas;
}

function actualizarSelectHoras(horasDisponibles) {
    const selectHora = document.getElementById('horaReserva');
    selectHora.innerHTML = '<option value="">Selecciona una hora</option>';

    horasDisponibles.forEach(hora => {
        const option = document.createElement('option');
        option.value = hora;
        option.textContent = hora;
        selectHora.appendChild(option);
    });
}


function insertarReserva(event, restauranteId) {
    event.preventDefault();
    const fechaReserva = document.getElementById('fechaReserva').value;
    const horaReserva = document.getElementById('horaReserva').value;
    const numPersonas = parseInt(document.getElementById('numPersonas').value);

    if (!fechaReserva || !horaReserva || !numPersonas) {
        mostrarModal("Por favor, complete todos los campos.");
        return;
    }

    if (!validarFechaReserva(fechaReserva)) {
        return;
    }
    let descuento = numPersonas * 1.5;
    if (descuento > 20) {
        descuento = 20;
    }

    peticion.accion = 'insertReservaId';
    peticion.restauranteId = restauranteId;
    peticion.fechaReserva = fechaReserva;
    peticion.horaReserva = horaReserva;
    peticion.numPersonas = numPersonas;
    peticion.descuento = descuento;
    peticion.userId = window.userId;

    postData("reservas.php", {data: peticion})
        .then(() => {
            mostrarModal(`Has realizado tu reserva con éxito.`);
            setTimeout(() => {
                window.location.href = "../ProfilePage/profilePage.html";
            }, 3000);
        })
        .catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarModal("Error en la solicitud, intente más tarde.");
        });
}

function validarFechaReserva(fecha) {
    if (!fecha) {
        mostrarModal("Por favor, selecciona una fecha.");
        return false;
    }
    const fechaSeleccionada = new Date(fecha);
    const dia = fechaSeleccionada.getUTCDay();
    if (dia === 1 || dia === 2) {
        mostrarModal("El bar está cerrado los lunes y martes.");
        return false;
    }
    return true;
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