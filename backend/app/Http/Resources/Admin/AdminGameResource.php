<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\GameScreenshotResource;
use App\Http\Resources\GameSystemRequirementResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminGameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $minReq = $this->relationLoaded('systemRequirements')
            ? $this->systemRequirements->firstWhere('type', 'minimum')
            : null;

        $recReq = $this->relationLoaded('systemRequirements')
            ? $this->systemRequirements->firstWhere('type', 'recommended')
            : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'developer' => $this->developer,
            'publisher' => $this->publisher,
            'game_type' => $this->game_type,
            'download_type' => $this->download_type ?: 'external',
            'direct_download_url' => $this->direct_download_url,
            'release_date' => $this->release_date?->format('Y-m-d'),
            'version' => $this->version,
            'file_size' => $this->file_size,
            'cover_image' => $this->cover_image,
            'banner_image' => $this->banner_image,
            'supported_languages' => $this->supported_languages ?? [],
            'last_updated' => $this->last_updated?->format('Y-m-d'),
            'rating' => (float) $this->rating,
            'download_count' => (int) $this->download_count,
            'official_source' => [
                'name' => $this->official_source_name,
                'url' => $this->official_source_url,
            ],
            'official_source_name' => $this->official_source_name,
            'official_source_url' => $this->official_source_url,
            'status' => $this->status,
            'featured' => (bool) $this->featured,
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'screenshots' => GameScreenshotResource::collection($this->whenLoaded('screenshots')),
            'system_requirements' => [
                'minimum' => $minReq ? new GameSystemRequirementResource($minReq) : null,
                'recommended' => $recReq ? new GameSystemRequirementResource($recReq) : null,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
