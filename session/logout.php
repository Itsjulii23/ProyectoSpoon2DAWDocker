<?php

//Archivo que se encarga de destruir la sesion para cerrar la sesion del usuario

session_start();
session_destroy();
echo json_encode(["status" => "ok", "message" => "Sesión cerrada correctamente"]);
exit();