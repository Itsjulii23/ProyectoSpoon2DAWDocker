<?php

//Archivo que recibe los datos de nuestro archivo php y hace las consultas en la base de datos
//en el apartado de la reserva del restaurante elegido

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONBOOKPAGE
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

    static public function selectHours(string $day, int $idRestaurante): array
    {
        $stmt = self::$pdo->prepare("
        SELECT hora_reserva, COUNT(*) as total
        FROM reserva
        WHERE fecha_reserva = :day AND restaurante_id = :idRestaurante
        GROUP BY hora_reserva
    ");

        $stmt->bindParam(':day', $day, PDO::PARAM_STR);
        $stmt->bindParam(':idRestaurante', $idRestaurante, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    static public function insertReservaId(int $idRestaurante, string $fechaReserva, string $horaReserva, int $numPersonas, int $userId, float $descuento): bool
    {
        $stmt = self::$pdo->prepare("
        INSERT INTO reserva (fecha_reserva, hora_reserva, num_personas, restaurante_id,usuario_id, descuento)
        VALUES (:fechaReserva, :horaReserva, :numPersonas, :idRestaurante, :userId, :descuento)
    ");
        $stmt->bindParam(':idRestaurante', $idRestaurante, PDO::PARAM_INT);
        $stmt->bindParam(':fechaReserva', $fechaReserva, PDO::PARAM_STR);
        $stmt->bindParam(':horaReserva', $horaReserva, PDO::PARAM_STR);
        $stmt->bindParam(':numPersonas', $numPersonas, PDO::PARAM_INT);
        $stmt->bindParam(':descuento', $descuento);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

SPOONBOOKPAGE::init('scoop');