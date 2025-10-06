<?php

namespace Database\Seeders;

use App\Models\Drink;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DrinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drinks = [
            // Bieren
            [
                'name' => 'Heineken',
                'description' => 'Nederlands premium lager bier met een lichte, frisse smaak',
                'type' => 'beer',
                'brand' => 'Heineken',
                'alcohol_percentage' => 5.0,
                'origin' => 'Nederland',
            ],
            [
                'name' => 'Duvel',
                'description' => 'Belgisch strong ale met een complexe, fruitige smaak',
                'type' => 'beer',
                'brand' => 'Duvel Moortgat',
                'alcohol_percentage' => 8.5,
                'origin' => 'België',
            ],
            [
                'name' => 'Grolsch Premium Lager',
                'description' => 'Nederlands premium bier met karakteristieke beugelfles',
                'type' => 'beer',
                'brand' => 'Grolsch',
                'alcohol_percentage' => 5.0,
                'origin' => 'Nederland',
            ],
            [
                'name' => 'La Chouffe',
                'description' => 'Belgisch blonde ale met kruidige toetsen',
                'type' => 'beer',
                'brand' => 'Achouffe',
                'alcohol_percentage' => 8.0,
                'origin' => 'België',
            ],

            // Wijnen
            [
                'name' => 'Chardonnay',
                'description' => 'Droge witte wijn met fruitige aroma\'s van appel en peer',
                'type' => 'wine',
                'brand' => 'Domaine de la Côte',
                'alcohol_percentage' => 13.5,
                'origin' => 'Frankrijk',
            ],
            [
                'name' => 'Pinot Noir',
                'description' => 'Elegante rode wijn met zachte tannines en kersenaroma\'s',
                'type' => 'wine',
                'brand' => 'Burgundy Estate',
                'alcohol_percentage' => 12.5,
                'origin' => 'Frankrijk',
            ],
            [
                'name' => 'Prosecco',
                'description' => 'Italiaanse mousserende wijn, licht en verfrissend',
                'type' => 'wine',
                'brand' => 'Villa Sandi',
                'alcohol_percentage' => 11.0,
                'origin' => 'Italië',
            ],

            // Sterke dranken
            [
                'name' => 'Ketel One Vodka',
                'description' => 'Premium Nederlandse vodka, geproduceerd sinds 1691',
                'type' => 'spirits',
                'brand' => 'Ketel One',
                'alcohol_percentage' => 40.0,
                'origin' => 'Nederland',
            ],
            [
                'name' => 'Jameson Irish Whiskey',
                'description' => 'Triple distilled Irish whiskey met zachte, ronde smaak',
                'type' => 'spirits',
                'brand' => 'Jameson',
                'alcohol_percentage' => 40.0,
                'origin' => 'Ierland',
            ],
            [
                'name' => 'Bombay Sapphire Gin',
                'description' => 'Premium London Dry Gin met 10 botanicals',
                'type' => 'spirits',
                'brand' => 'Bombay Sapphire',
                'alcohol_percentage' => 47.0,
                'origin' => 'Engeland',
            ],

            // Cocktails
            [
                'name' => 'Mojito',
                'description' => 'Cubaanse cocktail met witte rum, munt, limoen en bruiswater',
                'type' => 'cocktail',
                'brand' => null,
                'alcohol_percentage' => 12.0,
                'origin' => 'Cuba',
            ],
            [
                'name' => 'Old Fashioned',
                'description' => 'Klassieke whiskey cocktail met suiker, bitters en sinaasappel',
                'type' => 'cocktail',
                'brand' => null,
                'alcohol_percentage' => 35.0,
                'origin' => 'Verenigde Staten',
            ],
        ];

        foreach ($drinks as $drinkData) {
            Drink::firstOrCreate(
                ['name' => $drinkData['name']],
                $drinkData
            );
        }
    }
}
