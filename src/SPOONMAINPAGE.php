<?php

//Archivo que se encarga de de hacer las peticiones a la base de datos con los datos o las peticiones
//que recibe de nuestro backend.

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONMAINPAGE
{
    static public $pdo = null;

    static function init(string $base)
    {
        $conexion = new ConexionPdo();
        self::$pdo = ConexionPdo::conectar($base);
    }

    static public function selectRestaurantesMap(): ?array
    {
        $stmt = self::$pdo->prepare("SELECT id,nombre,latitud,longitud,img FROM restaurante");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    static public function selectRestaurantes(): ?array
    {
        $stmt = self::$pdo->prepare("SELECT id,nombre,descripcion,latitud,longitud,img FROM restaurante");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    static public function selectCategorias(): ?array
    {
        $stmt = self::$pdo->prepare("SELECT id,nombre FROM categoria_restaurante");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    static public function changeRestaurant(int $idCategoria): ?array
    {
        $stmt = self::$pdo->prepare("SELECT r.* FROM restaurante r 
        INNER JOIN categoria_restaurante c ON r.categoria_id = c.id 
        WHERE c.id = :id");
        $stmt->bindParam(':id', $idCategoria, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function loadModalReview($idRestaurante): ?array
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
        $stmt->bindParam(':id', $idRestaurante, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function isRestaurantFav(int $idUser, int $idRestaurant): bool
    {
        $stmt = self::$pdo->prepare("SELECT COUNT(*) FROM favoritos WHERE usuario_id = :usuario_id AND restaurante_id = :restaurant_id");
        $stmt->bindParam(':usuario_id', $idUser, PDO::PARAM_INT);
        $stmt->bindParam(':restaurant_id', $idRestaurant, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    static public function insertRestaurantFav(int $idUser, int $idRestaurant): void
    {
        $stmt = self::$pdo->prepare("INSERT INTO favoritos (usuario_id, restaurante_id) VALUES (:usuario_id, :restaurant_id)");
        $stmt->bindParam(':usuario_id', $idUser, PDO::PARAM_INT);
        $stmt->bindParam(':restaurant_id', $idRestaurant, PDO::PARAM_INT);
        $stmt->execute();
    }
}

SPOONMAINPAGE::init('scoop');