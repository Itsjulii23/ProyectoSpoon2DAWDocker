<?php

namespace tests;

use src\SPOONMAINPAGE;
use PHPUnit\Framework\TestCase;

class SPOONMAINPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONMAINPAGE::init('scoop');
    }

    public function testMostrarRestaurantesMapaRetirnArray()
    {
        $result = SPOONMAINPAGE::selectRestaurantesMap();
        $this->assertIsArray($result);
    }

    public function testSeleccionarRestaurantesReturnsArray()
    {
        $result = SPOONMAINPAGE::selectRestaurantes();
        $this->assertIsArray($result);
    }

    public function testCambiodeCategoriadeRestauranteReturnArray()
    {
        $idCategoria = 1;
        $result = SPOONMAINPAGE::changeRestaurant($idCategoria);
        $this->assertIsArray($result);
    }

    public function testCargarDatosDeLosRestaurantesCargaUnModalReturnsArray()
    {
        $idRestaurante = 1;
        $result = SPOONMAINPAGE::loadModalReview($idRestaurante);
        $this->assertIsArray($result);
    }

    public function testEsUnRestauranteFavoritoDelUsuarioReturnsBool()
    {
        $idUser = 17;
        $idRestaurante = 1;
        $result = SPOONMAINPAGE::isRestaurantFav($idUser, $idRestaurante);
        $this->assertTrue($result);
    }
}
