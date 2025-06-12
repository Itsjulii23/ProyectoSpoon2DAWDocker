<?php declare(strict_types=1);

//Archivo que se encarga de hacer el cifrado de las contraseñas de nuestros usuarios

class Cifrado
{
    const CLAVE = "DesarrolloWebEnEntornoServidor";
    const ALGORITMO = "aes-128-ctr";

    const IV = 'zzzzzzzzzzzzzzzz';

    public static function encriptar(string $cadena): string
    {
        return openssl_encrypt(
            $cadena,
            self::ALGORITMO,
            self::CLAVE,
            0,
            self::IV
        );
    }

    public static function desEncriptar(string $cadena): string
    {
        return openssl_decrypt(
            $cadena,
            self::ALGORITMO,
            self::CLAVE,
            0,
            self::IV
        );
    }

}