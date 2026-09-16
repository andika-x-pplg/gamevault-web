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
        Schema::create('game_system_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games')->cascadeOnDelete();
            $table->enum('type', ['minimum', 'recommended']);
            $table->string('os')->nullable();
            $table->string('processor')->nullable();
            $table->string('memory')->nullable();
            $table->string('graphics')->nullable();
            $table->string('storage')->nullable();
            $table->string('directx')->nullable();
            $table->timestamps();

            // Each game can have at most one minimum and one recommended requirement
            $table->unique(['game_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_system_requirements');
    }
};
