<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameSystemRequirement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'game_id',
        'type',
        'os',
        'processor',
        'memory',
        'graphics',
        'storage',
        'directx',
    ];

    /**
     * The game that owns the system requirements.
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
