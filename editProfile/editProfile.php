<?php

//Archivo que se encarga de recibir los datos del formulario para la edicion del perfil,
//los procesa y hace las consultas de datos para actualizar el usuario y la variable de usuario.

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

require '../src/ConexionPdo.php';

use src\ConexionPdo;

require '../Cifrado.php';

session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: loginPage.php");
    exit();
}

$conexion = new ConexionPdo();
$pdo = $conexion::conectar('scoop');

if (!isset($_POST['upUser'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$email = $_SESSION['usuario']['email'];
$user = $_POST['upUser'];

$sql = 'UPDATE usuario SET user = :user';
$params = [':user' => $user, ':email' => $email];

if (isset($_POST['upPass']) && $_POST['upPass'] !== "") {
    $password = Cifrado::encriptar($_POST['upPass']);
    $sql .= ', password = :password';
    $params[':password'] = $password;
}

$maxFileSize = 2 * 1024 * 1024;

if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === 0) {
    if ($_FILES['profileImage']['size'] > $maxFileSize) {
        echo json_encode(["success" => false, "message" => "La imagen de perfil supera los 2MB."]);
        exit;
    }
    $profileImageBase64 = base64_encode(file_get_contents($_FILES['profileImage']['tmp_name']));
    $sql .= ', profile_image = :profileImage';
    $params[':profileImage'] = $profileImageBase64;
}

if (isset($_FILES['bannerImage']) && $_FILES['bannerImage']['error'] === 0) {
    if ($_FILES['bannerImage']['size'] > $maxFileSize) {
        echo json_encode(["success" => false, "message" => "La imagen de banner supera los 2MB."]);
        exit;
    }
    $bannerImageBase64 = base64_encode(file_get_contents($_FILES['bannerImage']['tmp_name']));
    $sql .= ', banner_image = :bannerImage';
    $params[':bannerImage'] = $bannerImageBase64;
}

$sql .= ' WHERE email = :email';

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $_SESSION['usuario']['user'] = $user;
    if (isset($profileImageBase64)) $_SESSION['usuario']['profile_image'] = $profileImageBase64;
    if (isset($bannerImageBase64)) $_SESSION['usuario']['banner_image'] = $bannerImageBase64;

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error al actualizar perfil: " . $e->getMessage()]);
}
