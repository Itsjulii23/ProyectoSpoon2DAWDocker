<?php
//Archivo para introducir las oftos a mi base de datos ya que introducimos
//las rutas relativas de mis fotos en la base de datos.

use src\ConexionPdo;

ini_set('display_errors', 1);
error_reporting(E_ALL);
require '../ConexionPdo.php';
require '../Cifrado.php';
$conexion = new ConexionPdo();
$pdo = $conexion::conectar('scoop');
$carpeta = '../img/';
$archivos = scandir($carpeta);
$extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
foreach ($archivos as $archivo) {
    $extension = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
    if (in_array($extension, $extensionesPermitidas) && $archivo != '.' && $archivo != '..') {
        $rutaRelativa = 'img/' . $archivo;
        $sql = "UPDATE restaurante SET img = :ruta WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $id_restaurante = (int)substr($archivo, 0, strpos($archivo, '.'));
        if ($id_restaurante >= 1 && $id_restaurante <= 20) {
            $stmt->bindParam(':ruta', $rutaRelativa);
            $stmt->bindParam(':id', $id_restaurante, PDO::PARAM_INT);
            $stmt->execute();

            echo "Imagen asignada a restaurante id $id_restaurante: $rutaRelativa<br>";
        } else {
            echo "No se asignó la imagen al restaurante con id del nombre del archivo: $id_restaurante.<br>";
        }
    }
}