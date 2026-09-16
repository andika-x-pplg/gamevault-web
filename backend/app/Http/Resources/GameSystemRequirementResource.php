<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameSystemRequirementResource extends JsonResource
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
            'type' => $this->type,
            'os' => $this->os,
            'processor' => $this->processor,
            'memory' => $this->memory,
            'graphics' => $this->graphics,
            'storage' => $this->storage,
            'directx' => $this->directx,
        ];
    }
}
