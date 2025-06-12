<?php

//Se encarga de recibir los datos necesarios o de mandar las peticiones a un archivo que se encarga
//de hacer las peticiones a nuestra base de datos.

require_once __DIR__ . '/../vendor/autoload.php';

use src\SPOONMAINPAGE;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

session_start();
$request = json_decode(file_get_contents('php://input'), true);

if ($request) $request = $request['data'];

if ($request && $request['accion'] == 'cargarRestaurantesMap') {
    $restaurantes = SPOONMAINPAGE::selectRestaurantesMap();
    echo json_encode($restaurantes);
    die();
}

if ($request && $request['accion'] == 'cargarRestaurantes') {
    $restaurantes = SPOONMAINPAGE::selectRestaurantes();
    echo json_encode($restaurantes);
    die();
}

if ($request && $request['accion'] == 'cargarCategorias') {
    $categorias = SPOONMAINPAGE::selectCategorias();
    echo json_encode($categorias);
    die();
}

if ($request && $request['accion'] == 'changeRestaurant') {
    $categorias = SPOONMAINPAGE::changeRestaurant($request['idCategoria']);
    echo json_encode($categorias);
    die();
}

if ($request && $request['accion'] == 'loadModalReview') {
    $reviewsdata = SPOONMAINPAGE::loadModalReview($request['idRestaurante']);
    echo json_encode($reviewsdata);
    die();
}

if ($request && $request['accion'] == 'guardarRestaurante') {
    $isFav = SPOONMAINPAGE::isRestaurantFav($request['idUser'], $request['idRestaurante']);
    if ($isFav) {
        echo json_encode(['status' => 'exists']);
    } else {
        SPOONMAINPAGE::insertRestaurantFav($request['idUser'], $request['idRestaurante']);
        echo json_encode(['status' => 'ok']);
    }
    die();
}
