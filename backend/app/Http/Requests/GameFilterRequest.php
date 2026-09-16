<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GameFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:48',
            'search' => 'sometimes|string|max:100',
            'category' => 'sometimes|string|max:100',
            'type' => 'sometimes|string|in:free-to-play,freeware,open-source,demo,all',
            'sort' => 'sometimes|string|in:newest,oldest,popular,downloads,rating,az',
            'featured' => 'sometimes|in:true,false,1,0,yes,no',
        ];
    }

    /**
     * Handle a failed validation attempt with a clean JSON 422 response.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed for request parameters.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
