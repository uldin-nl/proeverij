<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\TastingSession;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Channel voor proeverij sessies
Broadcast::channel('tasting-session.{sessionId}', function ($user, $sessionId) {
    $session = TastingSession::find($sessionId);

    if (!$session) {
        return false;
    }

    // Check if user is participant in this session
    return $session->participants()->where('user_id', $user->id)->exists();
});

// Channel voor proeverij rondes
Broadcast::channel('tasting-round.{roundId}', function ($user, $roundId) {
    $round = \App\Models\TastingRound::with('tastingSession.participants')->find($roundId);

    if (!$round) {
        return false;
    }

    // Check if user is participant in this session
    return $round->tastingSession->participants()->where('user_id', $user->id)->exists();
});
