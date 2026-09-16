<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if the user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * The games added to the user's library.
     */
    public function libraryGames(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'library_games')
            ->withTimestamps();
    }

    /**
     * The games added to the user's wishlist.
     */
    public function wishlistGames(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'wishlist_games')
            ->withTimestamps();
    }
}
