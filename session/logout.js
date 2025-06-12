//Archivo que se encarga de destruir la sesion del usuario haciendo una peticion a nuestro archivo
//logout.js

document.getElementById("logoutBtn").addEventListener("click", cerrarSesion);

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
                alert(data.message);
                window.location.href = "../loginPage/loginPage.html";
            }
        })
        .catch(error => console.error("Error cerrando sesión:", error));
}