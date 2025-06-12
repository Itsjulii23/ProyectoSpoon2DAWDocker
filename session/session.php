<?php

//Archivo que se dedica de crear una variable que es la de los datos del usuario para
//ser usado en nuestra aplicacion

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['usuario'])) {
    echo json_encode([
        "status" => "ok",
        "usuario" => $_SESSION['usuario']
    ]);
} else {
    echo json_encode(["status" => "ko", "mensaje" => "Sesión no iniciada"]);
}
