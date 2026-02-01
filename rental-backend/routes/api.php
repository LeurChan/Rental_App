<?php

use Illuminate\Support\Facades\Route;

Route::get('/home', function () {
    return [
        ["id" => 1, "name" => "House A", "price" => 500],
        ["id" => 2, "name" => "House B", "price" => 750]
    ];
});