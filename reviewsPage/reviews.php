<?php

//Archivo que se encarga de recibir los datos desde nuestro archivo js para procesarlos y hacer
//peticiones a un archivo que se encarga de hacer las consultas a la base de datos dependiendo de la peticion
//que tenga que hacer.

require_once __DIR__ . '/../vendor/autoload.php';

use src\SPOONREVIEWSPAGE;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../loginPage/loginPage.php");
    exit();
}

$request = json_decode(file_get_contents('php://input'), true);

if ($request) $request = $request['data'];

if ($request && $request['accion'] == 'selectRestauranteId') {
    $dataRestauranteId = SPOONREVIEWSPAGE::selectRestauranteId($request['idRestaurante']);
    echo json_encode($dataRestauranteId);
    die();
}

if ($request && $request['accion'] == 'insertarReview') {
    $dataReviewId = SPOONREVIEWSPAGE::insertReview($request['idRestaurante'], $request['puntuacion'], $request['comentario'], $request['idUser']);
    echo json_encode($dataReviewId);
    die();
}