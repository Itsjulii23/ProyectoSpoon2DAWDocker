//Archivo que se dedica a las funcionalidades de mi interfaz de la edicion del perfil de usuario
//asi como poder cambiar la foto de perfil la del banner el nombre de usuario o la contraseña.

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "ko") {
                window.location.href = "../loginPage/loginPage.html";
                return;
            }
            window.userId = data.usuario.id;
            cargarHTML()
        })
        .catch(error => {
            console.error("Error al verificar la sesión:", error);
            window.location.href = "../loginPage/loginPage.html";
        });
});

function cargarHTML() {
    let html = `<section class="modalAlert">
    <div class="modalContainerAlert">
        <h2>SPOON</h2>
        <p></p>
    </div>
</section>

<header>
    <h1 class="title" onclick="window.location.href='../mainPage/mainPage.html'">Spoon</h1>
    <nav class="topnav">
        <a class="active" href="../mainPage/mainPage.html">Home</a>
    </nav>
</header>

<div class="main-container">
    <section class="registerForm">
        <form id="updateForm" enctype="multipart/form-data">
            <h3>Edita tu Usuario</h3>
            <div class="form-row">
                <label for="upUser">Usuario</label>
                <input type="text" id="upUser" name="upUser" autocomplete="username"/>
            </div>
            <div class="form-row">
                <label for="upPass">Cambiar Contraseña</label>
                <input type="password" id="upPass" name="upPass" autocomplete="new-password"/>
            </div>
            <div class="form-row">
                <label for="profileImage">Imagen de perfil</label>
                <input type="file" id="profileImage" name="profileImage" accept="image/*"/>
            </div>
            <div class="form-row">
                <label for="bannerImage">Imagen de Banner</label>
                <input type="file" id="bannerImage" name="bannerImage" accept="image/*"/>
            </div>
            <button type="submit" id="btnUpdate">Actualizar Perfil</button>
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
        <a href="../ProfilePage/profilePage.html" class="nav__link nav__link--active">
            <i class="material-icons nav__icon">person</i>
            <span class="material-symbols-outlined">
            Perfil
        </span>
        </a>
    </nav>
</footer>`;

    document.body.innerHTML = html;
    inicializarFormulario();
}

function inicializarFormulario() {
    let originalUser = "";
    let profileImage = null;
    let bannerImage = null;

    const userInput = document.getElementById("upUser");
    const passInput = document.getElementById("upPass");
    const profileInput = document.getElementById("profileImage");
    const bannerInput = document.getElementById("bannerImage");
    const form = document.getElementById("updateForm");

    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            originalUser = data.usuario.user;
            userInput.value = originalUser;
        });

    const maxFileSize = 2 * 1024 * 1024;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const currentUser = userInput.value.trim();
        const currentPass = passInput.value.trim();
        profileImage = profileInput.files[0];
        bannerImage = bannerInput.files[0];

        if (
            currentUser === originalUser &&
            currentPass === "" &&
            !profileImage &&
            !bannerImage
        ) {
            mostrarModal("No se ha realizado ningún cambio.");
            return;
        }

        if (profileImage && profileImage.size > maxFileSize) {
            mostrarModal("La imagen de perfil supera los 2MB.");
            return;
        }

        if (bannerImage && bannerImage.size > maxFileSize) {
            mostrarModal("La imagen de banner supera los 2MB.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", window.userId);
        formData.append("upUser", currentUser);
        if (currentPass !== "") formData.append("upPass", currentPass);
        if (profileImage) formData.append("profileImage", profileImage);
        if (bannerImage) formData.append("bannerImage", bannerImage);

        fetch("editProfile.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    mostrarModal("Perfil actualizado correctamente.");
                    setTimeout(() => {
                        window.location.href = "../ProfilePage/profilePage.html";
                    }, 3000);
                } else {
                    mostrarModal(result.message || "Hubo un error al actualizar.");
                }
            })
            .catch(err => {
                console.error("Error en la actualización:", err);
                mostrarModal("Error en la solicitud.");
            });
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