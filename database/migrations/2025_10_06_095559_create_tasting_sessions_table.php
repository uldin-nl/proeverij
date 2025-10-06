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
        Schema::create('tasting_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft');
            $table->integer('max_rounds')->default(5);
            $table->integer('current_round')->default(0);
            $table->string('invite_code', 8)->unique();
            $table->datetime('starts_at')->nullable();
            $table->datetime('ends_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasting_sessions');
    }
};
