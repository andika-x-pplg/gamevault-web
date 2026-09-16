<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Game extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'description',
        'developer',
        'publisher',
        'game_type',
        'release_date',
        'version',
        'file_size',
        'cover_image',
        'banner_image',
        'supported_languages',
        'last_updated',
        'rating',
        'download_count',
        'official_source_name',
        'official_source_url',
        'status',
        'featured',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'supported_languages' => 'array',
            'release_date' => 'date:Y-m-d',
            'last_updated' => 'date:Y-m-d',
            'rating' => 'decimal:1',
            'download_count' => 'integer',
            'featured' => 'boolean',
        ];
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Scope a query to only include published games.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include featured games.
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to filter games by game type.
     */
    public function scopeGameType(Builder $query, string $type): Builder
    {
        return $query->where('game_type', $type);
    }

    /**
     * The categories / genres that belong to the game.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_game')
            ->withTimestamps();
    }

    /**
     * All system requirements (minimum & recommended) for the game.
     */
    public function systemRequirements(): HasMany
    {
        return $this->hasMany(GameSystemRequirement::class);
    }

    /**
     * The minimum system requirements.
     */
    public function minimumRequirements(): HasOne
    {
        return $this->hasOne(GameSystemRequirement::class)->where('type', 'minimum');
    }

    /**
     * The recommended system requirements.
     */
    public function recommendedRequirements(): HasOne
    {
        return $this->hasOne(GameSystemRequirement::class)->where('type', 'recommended');
    }

    /**
     * Screenshots of the game ordered by sequence.
     */
    public function screenshots(): HasMany
    {
        return $this->hasMany(GameScreenshot::class)->orderBy('sort_order');
    }

    /**
     * Users who added this game to their personal library.
     */
    public function ownedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'library_games')
            ->withTimestamps();
    }

    /**
     * Users who added this game to their wishlist.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlist_games')
            ->withTimestamps();
    }
}
