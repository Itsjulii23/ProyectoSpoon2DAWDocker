<?php

//Archivo php que es una clase la cual se encarga de hacer las consultas a la base de datos
//con los datos que ha recibido del archivo php

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONBOOKINGPAGE
{
    static public $pdo = null;

    static function init(string $base)
    {
        $conexion = new ConexionPdo();
        self::$pdo = ConexionPdo::conectar($base);
    }

    static public function selectReservas(int $userId): ?array
    {
        $stmt = self::$pdo->prepare("
        SELECT r.*, res.nombre AS nombre_restaurante, res.img AS imagen_restaurante
        FROM reserva r
        JOIN restaurante res ON r.restaurante_id = res.id
        WHERE r.usuario_id = :userId");

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    static public function deleteReserva(int $idReserva): bool
    {
        $stmt = self::$pdo->prepare("DELETE FROM reserva WHERE id = :idReserva");
        $stmt->bindParam(':idReserva', $idReserva, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

SPOONBOOKINGPAGE::init('scoop');