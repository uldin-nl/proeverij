<?php

use App\Http\Controllers\DrinkController;
use App\Http\Controllers\TastingSessionController;
use App\Http\Controllers\TastingRoundController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Tasting Sessions
    Route::get('tasting/sessions', [TastingSessionController::class, 'index'])
        ->name('tasting.sessions.index');

    Route::get('tasting/sessions/create', [TastingSessionController::class, 'create'])
        ->name('tasting.sessions.create');

    Route::post('tasting/sessions', [TastingSessionController::class, 'store'])
        ->name('tasting.sessions.store');

    Route::get('tasting/sessions/{session}', [TastingSessionController::class, 'show'])
        ->name('tasting.sessions.show');

    Route::post('tasting/sessions/join', [TastingSessionController::class, 'join'])
        ->name('tasting.sessions.join');

    Route::post('tasting/sessions/{session}/start', [TastingSessionController::class, 'start'])
        ->name('tasting.sessions.start');

    Route::post('tasting/sessions/{session}/next-round', [TastingSessionController::class, 'nextRound'])
        ->name('tasting.sessions.next-round');

    Route::get('tasting/sessions/{session}/results', [TastingSessionController::class, 'results'])
        ->name('tasting.sessions.results');

    // Tasting Rounds
    Route::post('tasting/rounds/{round}/review', [TastingRoundController::class, 'review'])
        ->name('tasting.rounds.review');

    // Drinks
    Route::resource('tasting/drinks', DrinkController::class, [
        'names' => [
            'index' => 'tasting.drinks.index',
            'create' => 'tasting.drinks.create',
            'store' => 'tasting.drinks.store',
            'show' => 'tasting.drinks.show',
            'edit' => 'tasting.drinks.edit',
            'update' => 'tasting.drinks.update',
            'destroy' => 'tasting.drinks.destroy',
        ]
    ]);
});
