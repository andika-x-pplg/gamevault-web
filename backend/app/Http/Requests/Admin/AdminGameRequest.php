<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $mergeData = [];

        // Normalize game_type
        if ($this->has('game_type') || $this->has('license')) {
            $rawType = $this->input('game_type') ?? $this->input('license');
            if (is_string($rawType)) {
                $mergeData['game_type'] = Str::slug($rawType);
            }
        }

        // Normalize status
        if ($this->has('status')) {
            $mergeData['status'] = strtolower(trim((string) $this->input('status')));
        }

        // Normalize featured
        if ($this->has('featured')) {
            $mergeData['featured'] = filter_var($this->input('featured'), FILTER_VALIDATE_BOOLEAN);
        }

        // Normalize supported_languages if string
        if ($this->has('supported_languages') && is_string($this->input('supported_languages'))) {
            $langs = array_values(array_filter(array_map('trim', explode(',', $this->input('supported_languages')))));
            $mergeData['supported_languages'] = $langs;
        } elseif ($this->has('languages') && is_string($this->input('languages'))) {
            $langs = array_values(array_filter(array_map('trim', explode(',', $this->input('languages')))));
            $mergeData['supported_languages'] = $langs;
        }

        // Normalize shortDescription / description aliases if camelCase
        if ($this->has('shortDescription') && ! $this->has('short_description')) {
            $mergeData['short_description'] = $this->input('shortDescription');
        }
        if ($this->has('releaseDate') && ! $this->has('release_date')) {
            $mergeData['release_date'] = $this->input('releaseDate');
        }
        if ($this->has('fileSize') && ! $this->has('file_size')) {
            $mergeData['file_size'] = $this->input('fileSize');
        }
        if ($this->has('coverImage') && ! $this->has('cover_image')) {
            $mergeData['cover_image'] = $this->input('coverImage');
        }
        if ($this->has('bannerImage') && ! $this->has('banner_image')) {
            $mergeData['banner_image'] = $this->input('bannerImage');
        }
        if ($this->has('image') && ! $this->has('cover_image')) {
            $mergeData['cover_image'] = $this->input('image');
        }
        if ($this->has('banner') && ! $this->has('banner_image')) {
            $mergeData['banner_image'] = $this->input('banner');
        }
        if ($this->has('officialSourceName') && ! $this->has('official_source_name')) {
            $mergeData['official_source_name'] = $this->input('officialSourceName');
        }
        if ($this->has('officialSourceUrl') && ! $this->has('official_source_url')) {
            $mergeData['official_source_url'] = $this->input('officialSourceUrl');
        }
        if ($this->has('official_source') && is_array($this->input('official_source'))) {
            $mergeData['official_source_name'] = $this->input('official_source.name');
            $mergeData['official_source_url'] = $this->input('official_source.url');
        }

        // Normalize screenshots if string
        if ($this->has('screenshots') && is_string($this->input('screenshots'))) {
            $shots = array_values(array_filter(array_map('trim', explode(',', $this->input('screenshots')))));
            $mergeData['screenshots'] = $shots;
        }

        if (! empty($mergeData)) {
            $this->merge($mergeData);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $gameId = $this->route('game')?->id ?? $this->route('game') ?? $this->route('id');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('games', 'slug')->ignore($gameId),
            ],
            'short_description' => ['nullable', 'string'],
            'description' => ['required', 'string'],
            'developer' => ['required', 'string', 'max:255'],
            'publisher' => ['nullable', 'string', 'max:255'],
            'game_type' => ['required', 'string', Rule::in(['free-to-play', 'freeware', 'open-source', 'demo'])],
            'release_date' => ['nullable', 'date'],
            'version' => ['nullable', 'string', 'max:100'],
            'file_size' => ['nullable', 'string', 'max:100'],
            'cover_image' => ['nullable', 'string'],
            'banner_image' => ['nullable', 'string'],
            'supported_languages' => ['nullable', 'array'],
            'supported_languages.*' => ['string'],
            'last_updated' => ['nullable', 'date'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'download_count' => ['nullable', 'integer', 'min:0'],
            'official_source_name' => ['nullable', 'string', 'max:255'],
            'official_source_url' => ['nullable', 'url'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
            'featured' => ['nullable', 'boolean'],

            // Categories (can be IDs, names, or slugs)
            'categories' => ['nullable', 'array'],
            'category_ids' => ['nullable', 'array'],

            // Screenshots
            'screenshots' => ['nullable', 'array'],
            'screenshots.*' => ['nullable', 'string'],

            // System Requirements
            'system_requirements' => ['nullable', 'array'],
            'system_requirements.minimum' => ['nullable', 'array'],
            'system_requirements.minimum.os' => ['nullable', 'string'],
            'system_requirements.minimum.processor' => ['nullable', 'string'],
            'system_requirements.minimum.memory' => ['nullable', 'string'],
            'system_requirements.minimum.graphics' => ['nullable', 'string'],
            'system_requirements.minimum.storage' => ['nullable', 'string'],
            'system_requirements.minimum.directx' => ['nullable', 'string'],
            'system_requirements.recommended' => ['nullable', 'array'],
            'system_requirements.recommended.os' => ['nullable', 'string'],
            'system_requirements.recommended.processor' => ['nullable', 'string'],
            'system_requirements.recommended.memory' => ['nullable', 'string'],
            'system_requirements.recommended.graphics' => ['nullable', 'string'],
            'system_requirements.recommended.storage' => ['nullable', 'string'],
            'system_requirements.recommended.directx' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Game title is required.',
            'slug.required' => 'Game slug is required.',
            'slug.unique' => 'A game with this slug already exists.',
            'slug.regex' => 'The slug must contain only lowercase alphanumeric characters and hyphens.',
            'description.required' => 'Game description is required.',
            'developer.required' => 'Developer name is required.',
            'game_type.required' => 'Game type is required.',
            'game_type.in' => 'Game type must be one of: Free-to-Play, Freeware, Open Source, Demo.',
            'status.in' => 'Status must be either draft or published.',
            'official_source_url.url' => 'Official source must be a valid URL (e.g. https://...).',
        ];
    }
}
