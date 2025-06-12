<?php

namespace tests;

use DateTime;
use src\SPOONBOOKPAGE;
use PHPUnit\Framework\TestCase;

class SPOONBOOKPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONBOOKPAGE::init('scoop');
    }

    public function testSelectRestauranteIdReturnsArray()
    {
        $idRestaurante = 1;
        $result = SPOONBOOKPAGE::selectRestauranteId($idRestaurante);
        $this->assertIsArray($result);
    }

    public function testSelectHoursByRestaurantIdReturnsArray()
    {
        $idRestaurante = 1;
        $rawDate = '25:07:2025';
        $day = DateTime::createFromFormat('d:m:Y', $rawDate)->format('Y-m-d');
        $result = SPOONBOOKPAGE::selectHours($day, $idRestaurante);
        $this->assertIsArray($result);
    }
}
