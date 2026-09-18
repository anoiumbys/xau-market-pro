<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketParameterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'symbol' => ['required', 'string', Rule::in(['XAUUSD'])],
            'support_levels' => ['required', 'array', 'min:3'],
            'support_levels.*' => ['numeric', 'min:0', 'max:10000'],
            'resistance_levels' => ['required', 'array', 'min:3'],
            'resistance_levels.*' => ['numeric', 'min:0', 'max:10000'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'support_levels.min' => 'At least 3 support levels are required.',
            'resistance_levels.min' => 'At least 3 resistance levels are required.',
            'support_levels.*.numeric' => 'Support levels must be numeric.',
            'resistance_levels.*.numeric' => 'Resistance levels must be numeric.',
        ];
    }
}