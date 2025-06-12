<?php

//Archivo que se encarga de recibir los datos de mi archivo js para procesarlos y mandarlos
//a mi archivo que se encarga de hacer las consultas a la base de datos.

require_once __DIR__ . '/../vendor/autoload.php';

use src\SPOONFAVPAGE;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

session_start();
$request = json_decode(file_get_contents('php://input'), true);

if ($request) $request = $request['data'];

if ($request && $request['accion'] == 'selectRestaurantesFav') {
    $restaurantesFav = SPOONFAVPAGE::selectRestaurantesFav($request['userId']);
    echo json_encode($restaurantesFav);
    die();
}

if ($request && $request['accion'] == 'deleteRestauranteFav') {
    $restauranteFav = SPOONFAVPAGE::deleteRestauranteFav($request['idRestauranteFav']);
    echo json_encode($restauranteFav);
    die();
}

if ($request && $request['accion'] == 'loadModalReview') {
    $restauranteFav = SPOONFAVPAGE::loadModalReview($request['idRestauranteFav']);
    echo json_encode($restauranteFav);
    die();
}