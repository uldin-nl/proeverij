<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use App\Models\TastingSession;
use App\Models\TastingRound;
use App\Models\SessionParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TastingSessionController extends Controller
{
    public function index(): Response
    {
        $sessions = TastingSession::with(['host', 'participants.user'])
            ->where('host_id', Auth::id())
            ->orWhereHas('participants', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('tasting/sessions/index', [
            'sessions' => $sessions,
        ]);
    }

    public function create(): Response
    {
        $drinks = Drink::all();

        return Inertia::render('tasting/sessions/create', [
            'drinks' => $drinks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'max_rounds' => 'required|integer|min:1|max:10',
            'drink_ids' => 'required|array|min:1',
            'drink_ids.*' => 'exists:drinks,id',
        ]);

        $session = TastingSession::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'host_id' => Auth::id(),
            'max_rounds' => $validated['max_rounds'],
        ]);

        // Voeg host toe als participant
        SessionParticipant::create([
            'tasting_session_id' => $session->id,
            'user_id' => Auth::id(),
            'role' => 'host',
        ]);

        // Maak rondes aan met de geselecteerde drankjes
        foreach ($validated['drink_ids'] as $index => $drinkId) {
            if ($index < $validated['max_rounds']) {
                TastingRound::create([
                    'tasting_session_id' => $session->id,
                    'drink_id' => $drinkId,
                    'round_number' => $index + 1,
                ]);
            }
        }

        return redirect()->route('tasting.sessions.show', $session)
            ->with('success', 'Proeverij sessie succesvol aangemaakt!');
    }

    public function show(TastingSession $session): Response
    {
        $session->load([
            'host',
            'participants.user',
            'rounds.drink',
            'rounds.reviews.user'
        ]);

        // Ensure average_rating is calculated for each round
        $session->rounds->each(function ($round) {
            $round->average_rating = $round->reviews->avg('rating') ?? 0;
        });

        $userParticipant = $session->participants()
            ->where('user_id', Auth::id())
            ->first();

        $currentRound = $session->rounds()
            ->where('round_number', $session->current_round)
            ->with(['drink', 'reviews.user'])
            ->first();

        // Ensure average_rating is calculated for current round
        if ($currentRound) {
            $currentRound->average_rating = $currentRound->reviews->avg('rating') ?? 0;
        }

        return Inertia::render('tasting/sessions/show', [
            'session' => $session,
            'userParticipant' => $userParticipant,
            'currentRound' => $currentRound,
            'canManage' => $userParticipant?->isHost() || Auth::id() === $session->host_id,
        ]);
    }

    public function join(Request $request): RedirectResponse
    {
        $request->validate([
            'invite_code' => 'required|string|size:8',
        ]);

        $session = TastingSession::where('invite_code', $request->invite_code)->first();

        if (!$session) {
            return back()->withErrors(['invite_code' => 'Ongeldige uitnodigingscode.']);
        }

        if ($session->status === 'completed') {
            return back()->withErrors(['invite_code' => 'Deze proeverij is al afgerond.']);
        }

        $existingParticipant = SessionParticipant::where([
            'tasting_session_id' => $session->id,
            'user_id' => Auth::id(),
        ])->first();

        if ($existingParticipant) {
            return redirect()->route('tasting.sessions.show', $session)
                ->with('info', 'Je doet al mee aan deze proeverij.');
        }

        $participant = SessionParticipant::create([
            'tasting_session_id' => $session->id,
            'user_id' => Auth::id(),
        ]);

        // Broadcast new participant
        broadcast(new \App\Events\ParticipantJoined($session, $participant));

        return redirect()->route('tasting.sessions.show', $session)
            ->with('success', 'Je doet nu mee aan de proeverij!');
    }

    public function start(TastingSession $session): RedirectResponse
    {
        if (!$session->canStart()) {
            return back()->withErrors(['session' => 'Deze sessie kan niet gestart worden.']);
        }

        $previousStatus = $session->status;
        $session->update([
            'status' => 'active',
            'current_round' => 1,
            'starts_at' => now(),
        ]);

        // Broadcast session status change
        broadcast(new \App\Events\SessionStatusChanged($session, $previousStatus));

        // Start eerste ronde
        $firstRound = $session->rounds()->where('round_number', 1)->first();
        if ($firstRound) {
            $previousRoundStatus = $firstRound->status;
            $firstRound->update([
                'status' => 'active',
                'started_at' => now(),
            ]);

            // Broadcast round status change
            broadcast(new \App\Events\RoundStatusChanged($firstRound, $session, $previousRoundStatus));
        }

        return back()->with('success', 'Proeverij gestart!');
    }

    public function nextRound(TastingSession $session): RedirectResponse
    {
        if ($session->current_round >= $session->max_rounds) {
            return $this->complete($session);
        }

        // Huidige ronde afronden
        $currentRound = $session->rounds()
            ->where('round_number', $session->current_round)
            ->first();

        if ($currentRound) {
            $previousStatus = $currentRound->status;
            $currentRound->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Broadcast current round completion
            broadcast(new \App\Events\RoundStatusChanged($currentRound, $session, $previousStatus));
        }

        // Volgende ronde starten
        $nextRoundNumber = $session->current_round + 1;
        $session->update(['current_round' => $nextRoundNumber]);

        $nextRound = $session->rounds()
            ->where('round_number', $nextRoundNumber)
            ->first();

        if ($nextRound) {
            $previousStatus = $nextRound->status;
            $nextRound->update([
                'status' => 'active',
                'started_at' => now(),
            ]);

            // Broadcast next round start
            broadcast(new \App\Events\RoundStatusChanged($nextRound, $session, $previousStatus));
        }

        return back()->with('success', "Ronde {$nextRoundNumber} gestart!");
    }

    private function complete(TastingSession $session): RedirectResponse
    {
        $previousStatus = $session->status;
        $session->update([
            'status' => 'completed',
            'ends_at' => now(),
        ]);

        // Broadcast session completion
        broadcast(new \App\Events\SessionStatusChanged($session, $previousStatus));

        return back()->with('success', 'Proeverij afgerond!');
    }

    public function results(TastingSession $session)
    {
        if ($session->status !== 'completed') {
            return redirect()->route('tasting.sessions.show', $session);
        }

        $session->load([
            'rounds.drink',
            'rounds.reviews.user'
        ]);

        $results = $session->rounds->map(function ($round) {
            return [
                'round_number' => $round->round_number,
                'drink' => $round->drink,
                'average_rating' => $round->average_rating,
                'total_reviews' => $round->reviews->count(),
                'reviews' => $round->reviews,
            ];
        })->sortByDesc('average_rating');

        return Inertia::render('tasting/sessions/results', [
            'session' => $session,
            'results' => $results->values(),
        ]);
    }
}
