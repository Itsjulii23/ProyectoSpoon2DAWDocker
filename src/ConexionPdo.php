<?php

namespace src;

require_once __DIR__ . '/../config.php';

use PDO;
use PDOException;

class ConexionPdo
{
    public static function conectar(string $bd = '')
    {
        $host = $_ENV['DB_HOST'];
        $usuario = $_ENV['DB_USERNAME'];
        $clave = $_ENV['DB_PASSWORD'];

        $opciones = [
            PDO::ATTR_EMULATE_PREPARES => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            PDO::MYSQL_ATTR_LOCAL_INFILE => true,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
        ];

        $pdo = null;

        try {
            $dsn = empty($bd)
                ? "mysql:host=$host;"
                : "mysql:dbname=$bd;host=$host;";

            $pdo = new PDO($dsn, $usuario, $clave, $opciones);

        } catch (PDOException $e) {
            echo "[x] Conexion fallida: " . $e->getMessage();
        }

        return $pdo;
    }
}