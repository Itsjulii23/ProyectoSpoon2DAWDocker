<?php

namespace tests;

use PHPUnit\Framework\TestCase;
use src\SPOONBOOKINGPAGE;

class SPOONBOOKINGPAGETest extends TestCase
{
    protected function setUp(): void
    {
        SPOONBOOKINGPAGE::init('scoop');
    }

    public function testSelectReservasReturnsArray()
    {
        $userId = 17;
        $result = SPOONBOOKINGPAGE::selectReservas($userId);
        $this->assertIsArray($result);
    }
}
