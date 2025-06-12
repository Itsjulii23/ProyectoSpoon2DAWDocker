<?php

//Archivo que se encarga de hacer las consultas a la base de datos dependiendo de las peticones recibidas..

namespace src;

ini_set("error_reporting", E_ALL);
ini_set("display_errors", "on");

use PDO;
use src\ConexionPdo;

class SPOONVIEWREVIEWSPAGE
{
    static public $pdo = null;

    static function init(string $base)
    {
        $conexion = new ConexionPdo();
        self::$pdo = ConexionPdo::conectar($base);
    }

    static public function cargarValoraciones(int $userId): ?array
    {
        $stmt = self::$pdo->prepare("
        SELECT v.*, 
               res.nombre AS nombre_restaurante,
               u.user AS nombre_usuario,
               u.email AS email_usuario
        FROM valoracion v
        JOIN restaurante res ON v.restaurante_id = res.id
        JOIN usuario u ON v.usuario_id = u.id
        WHERE v.usuario_id = :userId
    ");

        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    static public function eliminarValoracion(int $idValoracion): bool
    {
        $stmt = self::$pdo->prepare("DELETE FROM valoracion WHERE id = :idValoracion");
        $stmt->bindParam(':idValoracion', $idValoracion, PDO::PARAM_INT);
        return $stmt->execute();
    }
}

SPOONVIEWREVIEWSPAGE::init('scoop');