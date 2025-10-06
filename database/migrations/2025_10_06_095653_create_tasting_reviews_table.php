<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasting_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tasting_round_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('rating')->min(1)->max(5);
            $table->text('review')->nullable();
            $table->json('tags')->nullable(); // voor tags zoals 'bitter', 'zoet', 'fruitig', etc.
            $table->timestamps();

            $table->unique(['tasting_round_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasting_reviews');
    }
};
