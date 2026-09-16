<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->name, // Compatibility with React frontend
            'email' => $this->email,
            'role' => $this->role ?? 'user',
            'status' => $this->status ?? 'active',
            'avatar' => $this->avatar ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
