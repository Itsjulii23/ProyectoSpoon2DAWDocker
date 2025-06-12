//Se encarga de dar funcionalidades a mi interfaz de usuario asi como la posibilidad
//cerrar la sesion.

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
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "ko") {
                window.location.href = "../loginPage/loginPage.html";
                return;
            }
            const profileImage = data.usuario.profile_image ? `data:image/jpeg;base64,${data.usuario.profile_image}` : '../img/logo.png';
            const bannerImage = data.usuario.banner_image ? `data:image/jpeg;base64,${data.usuario.banner_image}` : '../img/home.jpg';
            const birthdate = new Date(data.usuario.birthdate);
            const age = calcularEdad(birthdate);

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
        <nav class="topnav">`;

            html += `<a href="../mainPage/mainPage.html">Home</a>`;

            if (!isLoggedIn) {
                html += `
            <a class="active" id="loginLink" href="../loginPage/loginPage.html">Login</a>
            <a id="signupLink" href="../registerPage/registerPage.html">Sign Up</a>`;
            }

            html += `</nav>
    </header>`

            html += `
<section id="userProfile">
                <div class="userInfo">
                    <img src="${bannerImage}" alt="banner">
                    <div class="profilePhoto">
                        <img src="${profileImage}" alt="profile">
                        <button onclick="window.location.href='../editProfile/editProfile.html'">Editar Perfil</button>
                    </div>
                    <h2>Bienvenido a tu perfil</h2>
                    <h3 id="userEmail">Correo: ${data.usuario.email}</h3>
                    <h3 id="userUser">Usuario: ${data.usuario.user}</h3>
                    <h3 id="userAge">Edad: ${age}</h3>
                    <a href="../bookingPage/bookingPage.html">
                        <button class="viewBtn">Ver tus Reservas</button>
                    </a>
                    <a href="../viewReviewsPage/viewReviewsPage.html">
                        <button class="viewBtn">Ver tus Reseñas</button>
                    </a>
                    <a href="../favPage/favPage.html">
                        <button class="viewBtn">Mis restaurantes favoritos</button>
                    </a>
                    <button id="logoutBtn">Cerrar Sesión</button>
                </div>
</section>
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
        <a href="../ProfilePage/profilePage.html" class="nav__link nav__link--active">
            <i class="material-icons nav__icon">person</i>
            <span class="material-symbols-outlined">
            Perfil
        </span>
        </a>
    </nav>
</footer>`;
            document.body.innerHTML = html;
            document.getElementById("logoutBtn").addEventListener("click", cerrarSesion);
        });
}

document.addEventListener("DOMContentLoaded", function () {
});


function calcularEdad(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
}

function cerrarSesion() {
    fetch("../session/logout.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                mostrarModal("Has cerrado sesión con éxito.");
                setTimeout(() => {
                    window.location.href = "../loginPage/loginPage.html";
                }, 3000);
            } else {
                mostrarModal("No se ha podido cerrar sesión.");
            }
        })
        .catch(error => console.error("Error cerrando sesión:", error));
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