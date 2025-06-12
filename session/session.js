//Archivo que se dedica de recibir los datos del usuario de nuestro archivo php
//que se encarga de iniciar la sesion con los datos que le hemos pasado en nuestro
//formulario de inicio de sesion o de registro.

document.addEventListener("DOMContentLoaded", function () {
    fetch("../session/session.php")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === "ok") {
                window.userId = data.usuario.id;
            } else {
                console.warn("No has iniciado sesión.");
            }
        })
        .catch(error => console.error("Error al obtener sesión:", error));
});