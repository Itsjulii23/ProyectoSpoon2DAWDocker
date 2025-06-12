<?php

namespace tests;

use src\SPOONREVIEWSPAGE;
use PHPUnit\Framework\TestCase;

class SPOONREVIEWSPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONREVIEWSPAGE::init('scoop');
    }

    public function testSelectRestauranteIdReviewReturnsArray()
    {
        $idRestaurante = 1;
        $result = SPOONREVIEWSPAGE::selectRestauranteId($idRestaurante);
        $this->assertIsArray($result);
    }
}
