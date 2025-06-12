<?php

//Archivo que se encarga de recibir los datos de mi archivo php para hacer las consulta a
//mi base de datos en la interfaz de restaurantes guardados.

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONFAVPAGE
{
    static public $pdo = null;

    static function init(string $base)
    {
        $conexion = new ConexionPdo();
        self::$pdo = ConexionPdo::conectar($base);
    }

    static public function selectRestaurantesFav(int $userId): ?array
    {
        $stmt = self::$pdo->prepare("
        SELECT r.id, r.nombre, r.descripcion, r.img
        FROM favoritos f
        INNER JOIN restaurante r ON f.restaurante_id = r.id
        WHERE f.usuario_id = :userId
    ");
        $stmt->execute(['userId' => $userId]);
        return $stmt->fetchAll();
    }

    static public function deleteRestauranteFav(int $idRestauranteFav): bool
    {
        $stmt = self::$pdo->prepare("DELETE FROM favoritos WHERE restaurante_id = :idRestauranteFav");
        $stmt->bindParam(':idRestauranteFav', $idRestauranteFav, PDO::PARAM_INT);
        return $stmt->execute();
    }

    static public function loadModalReview($idRestauranteFav): ?array
    {
        $stmt = self::$pdo->prepare("SELECT 
        valoracion.id, 
        valoracion.puntuacion, 
        valoracion.comentario, 
        restaurante.nombre AS restaurante_nombre, 
        usuario.email AS usuario_nombre
    FROM valoracion
    JOIN restaurante ON valoracion.restaurante_id = restaurante.id
    JOIN usuario ON valoracion.usuario_id = usuario.id
    WHERE valoracion.restaurante_id = :id
    ");
        $stmt->bindParam(':id', $idRestauranteFav, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

SPOONFAVPAGE::init('scoop');