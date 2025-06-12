<?php

namespace tests;

use src\SPOONFAVPAGE;
use PHPUnit\Framework\TestCase;

class SPOONFAVPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONFAVPAGE::init('scoop');
    }

    public function testSelectFavRestaurantesReturnsArray()
    {
        $iduser = 17;
        $result = SPOONFAVPAGE::selectRestaurantesFav($iduser);
        $this->assertIsArray($result);
    }
}
