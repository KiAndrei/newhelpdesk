<?php

use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// All routes here are automatically prefixed with /api

Route::get('/tickets', [TicketController::class, 'index']);
Route::post('/tickets', [TicketController::class, 'store']);
Route::get('/tickets/{id}', [TicketController::class, 'show'])->where('id', '[0-9]{1,9}');
Route::match(['put', 'patch'], '/tickets/{id}', [TicketController::class, 'update'])->where('id', '[0-9]{1,9}');
Route::delete('/tickets/{id}', [TicketController::class, 'destroy'])->where('id', '[0-9]{1,9}');
