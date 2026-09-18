<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionGameResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'developer' => $this->developer,
            'publisher' => $this->publisher,
            'game_type' => $this->game_type,
            'release_date' => $this->release_date?->format('Y-m-d'),
            'version' => $this->version,
            'file_size' => $this->file_size,
            'cover_image' => $this->cover_image,
            'banner_image' => $this->banner_image,
            'rating' => (float) $this->rating,
            'download_count' => (int) $this->download_count,
            'status' => $this->status,
            'featured' => (bool) $this->featured,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'added_at' => $this->pivot?->created_at?->toIso8601String() ?? $this->created_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
