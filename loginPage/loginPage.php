<?php

//Archivo que se encarga de iniciar la sesion despues de recibir y verificar los dattos que le hemos
//pasado en nuestro formulario de inicio de sesion.


ini_set('error_reporting', E_ALL);
ini_set('display_errors', 'on');

require '../src/ConexionPdo.php';

use src\ConexionPdo;

require '../Cifrado.php';

session_start();

$conexion = new ConexionPdo();
$pdo = $conexion::conectar("scoop");

$request = json_decode(trim(file_get_contents("php://input")), true);

if (!isset($request["data"])) {
    echo json_encode(["status" => "error", "mensaje" => "Datos no recibidos"]);
    exit;
}

$request = $request["data"];

if ($request['accion'] === 'login') {
    $stmt = $pdo->prepare("SELECT id, email, password, user, birthdate, profile_image, banner_image FROM usuario WHERE email = :email");
    $stmt->execute([":email" => $request['email']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(["status" => "ko", "mensaje" => "El correo no está registrado"]);
        exit;
    }

    $password_descifrada = Cifrado::desEncriptar($usuario['password']);
    if ($request['password'] !== $password_descifrada) {
        echo json_encode(["status" => "ko", "mensaje" => "Contraseña incorrecta"]);
        exit;
    }

    $_SESSION['usuario'] = [
        "id" => $usuario['id'],
        "email" => $usuario['email'],
        "user" => $usuario['user'],
        "birthdate" => $usuario['birthdate'],
        "profile_image" => $usuario['profile_image'],
        "banner_image" => $usuario['banner_image']
    ];


    echo json_encode(["status" => "ok", "mensaje" => "Inicio de sesión exitoso"]);
    exit;
}