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
        Schema::create('tasting_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tasting_session_id')->constrained()->onDelete('cascade');
            $table->foreignId('drink_id')->constrained()->onDelete('cascade');
            $table->integer('round_number');
            $table->enum('status', ['pending', 'active', 'completed'])->default('pending');
            $table->datetime('started_at')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['tasting_session_id', 'round_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasting_rounds');
    }
};
