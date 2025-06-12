<?php

namespace tests;

use src\SPOONVIEWREVIEWSPAGE;
use PHPUnit\Framework\TestCase;

class SPOONVIEWREVIEWSPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONVIEWREVIEWSPAGE::init('scoop');
    }

    public function testSelectRestauranteIdReturnsArray()
    {
        $idUser = 17;
        $result = SPOONVIEWREVIEWSPAGE::cargarValoraciones($idUser);
        $this->assertIsArray($result);
    }
}
