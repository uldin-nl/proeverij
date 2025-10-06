<?php

namespace App\Http\Controllers;

use App\Models\TastingRound;
use App\Models\TastingReview;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TastingRoundController extends Controller
{
    public function review(Request $request, TastingRound $round): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        // Check if round is active
        if (!$round->isActive()) {
            return back()->withErrors(['round' => 'Deze ronde is niet meer actief.']);
        }

        // Check if user is participant
        $participant = $round->tastingSession->participants()
            ->where('user_id', Auth::id())
            ->first();

        if (!$participant) {
            return back()->withErrors(['session' => 'Je bent geen deelnemer van deze proeverij.']);
        }

        // Create or update review
        $review = TastingReview::updateOrCreate(
            [
                'tasting_round_id' => $round->id,
                'user_id' => Auth::id(),
            ],
            [
                'rating' => $validated['rating'],
                'review' => $validated['review'],
                'tags' => $validated['tags'] ?? [],
            ]
        );

        // Broadcast new/updated review
        broadcast(new \App\Events\ReviewSubmitted($review, $round));

        return back()->with('success', 'Je review is opgeslagen!');
    }
}
