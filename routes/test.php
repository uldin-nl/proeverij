<?php

use Illuminate\Support\Facades\Route;
use App\Events\ParticipantJoined;
use App\Models\TastingSession;
use App\Models\User;

Route::middleware(['auth'])->group(function () {
    Route::get('/test/broadcast/{sessionId}', function ($sessionId) {
        $session = TastingSession::with(['participants.user', 'host'])->findOrFail($sessionId);
        $user = request()->user();

        // Simulate a participant joining
        $participant = $session->participants()->where('user_id', $user->id)->first();

        if ($participant) {
            broadcast(new ParticipantJoined($session, $participant))->toOthers();
            return response()->json(['message' => 'Broadcast sent successfully']);
        }

        return response()->json(['error' => 'User not a participant'], 400);
    });
});
