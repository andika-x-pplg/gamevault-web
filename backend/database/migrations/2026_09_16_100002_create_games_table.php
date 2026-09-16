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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->text('description');
            $table->string('developer');
            $table->string('publisher')->nullable();
            $table->enum('game_type', ['free-to-play', 'freeware', 'open-source', 'demo'])->default('free-to-play');
            $table->date('release_date')->nullable();
            $table->string('version')->nullable();
            $table->string('file_size')->nullable();
            $table->text('cover_image')->nullable();
            $table->text('banner_image')->nullable();
            $table->json('supported_languages')->nullable();
            $table->date('last_updated')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->unsignedBigInteger('download_count')->default(0);
            $table->string('official_source_name')->nullable();
            $table->text('official_source_url')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->timestamps();

            // Query optimization indexes
            $table->index('status');
            $table->index('game_type');
            $table->index('release_date');
            $table->index(['status', 'featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
