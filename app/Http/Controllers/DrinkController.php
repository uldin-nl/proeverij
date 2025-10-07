<?php

namespace App\Http\Controllers;

use App\Models\Drink;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DrinkController extends Controller
{
    public function index(): Response
    {
        $drinks = Drink::orderBy('name')->paginate(12);

        return Inertia::render('tasting/drinks/index', [
            'drinks' => $drinks,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tasting/drinks/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:beer,wine,spirits,cocktail,other',
            'alcohol_percentage' => 'nullable|numeric|min:0|max:100',
            'brand' => 'nullable|string|max:255',
            'origin' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
        ]);

        Drink::create($validated);

        // Check if we came from session creation page
        if (request()->header('referer') && str_contains(request()->header('referer'), '/tasting/sessions/create')) {
            return redirect()->route('tasting.sessions.create')
                ->with('success', 'Drankje succesvol toegevoegd!');
        }

        return redirect()->route('tasting.drinks.index')
            ->with('success', 'Drankje succesvol toegevoegd!');
    }

    public function show(Drink $drink): Response
    {
        $drink->load(['tastingRounds.tastingSession', 'tastingRounds.reviews']);

        return Inertia::render('tasting/drinks/show', [
            'drink' => $drink,
        ]);
    }

    public function edit(Drink $drink): Response
    {
        return Inertia::render('tasting/drinks/edit', [
            'drink' => $drink,
        ]);
    }

    public function update(Request $request, Drink $drink): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:beer,wine,spirits,cocktail,other',
            'alcohol_percentage' => 'nullable|numeric|min:0|max:100',
            'brand' => 'nullable|string|max:255',
            'origin' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
        ]);

        $drink->update($validated);

        return redirect()->route('tasting.drinks.show', $drink)
            ->with('success', 'Drankje succesvol bijgewerkt!');
    }

    public function destroy(Drink $drink): RedirectResponse
    {
        $drink->delete();

        return redirect()->route('tasting.drinks.index')
            ->with('success', 'Drankje verwijderd!');
    }
}
