<?php

//Archivo que se encarga de hacer las consultas a la base de datos recibiendo los datos de nuestro backend.

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONREVIEWSPAGE
{

    static public $pdo = null;

    static function init(string $base)
    {
        $conexion = new ConexionPdo();
        self::$pdo = ConexionPdo::conectar($base);
    }

    static public function selectRestauranteId(int $idRestaurante): ?array
    {
        $stmt = self::$pdo->prepare("SELECT * FROM restaurante WHERE restaurante.id = :idRestaurante");
        $stmt->bindParam(':idRestaurante', $idRestaurante, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    static public function insertReview(int $idRestaurante, int $puntuacion, string $comentario, int $idUser): bool
    {
        $stmt = self::$pdo->prepare("INSERT INTO valoracion (puntuacion,comentario,restaurante_id,usuario_id)
        VALUES (:puntuacion,:comentario,:idRestaurante,:idUser)
    ");
        $stmt->bindParam(':puntuacion', $puntuacion, PDO::PARAM_INT);
        $stmt->bindParam(':comentario', $comentario, PDO::PARAM_STR);
        $stmt->bindParam(':idRestaurante', $idRestaurante, PDO::PARAM_STR);
        $stmt->bindParam(':idUser', $idUser, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

SPOONREVIEWSPAGE::init('scoop');