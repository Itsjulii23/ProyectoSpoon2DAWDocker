<?php

//Archivo en donde recibimos los datos de nuestro archivo js y los mandamos a un archivo
//que se encarga de hacer las consultas de las bases de datos

require_once __DIR__ . '/../vendor/autoload.php';

use src\SPOONBOOKPAGE;

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
    $dataRestauranteId = SPOONBOOKPAGE::selectRestauranteId($request['restauranteId']);
    echo json_encode($dataRestauranteId);
    die();
}

if ($request && $request['accion'] == 'selectHours') {
    $dataRestauranteId = SPOONBOOKPAGE::selectHours($request['day'], $request['idRestaurante']);
    echo json_encode($dataRestauranteId);
    die();
}

if ($request && $request['accion'] == 'insertReservaId') {
    $dataReservaId = SPOONBOOKPAGE::insertReservaId($request['restauranteId'], $request['fechaReserva'], $request['horaReserva'], $request['numPersonas'], $request['userId'], $request['descuento']);
    echo json_decode($dataReservaId);
    die();
}