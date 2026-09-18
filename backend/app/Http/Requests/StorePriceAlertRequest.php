<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePriceAlertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'symbol' => ['required', 'string', Rule::in(['XAUUSD'])],
            'condition' => ['required', 'string', Rule::in(['above', 'below', 'cross'])],
            'price_level' => ['required', 'numeric', 'min:0', 'max:10000'],
        ];
    }

    public function messages(): array
    {
        return [
            'symbol.in' => 'Invalid symbol. Only XAUUSD is supported.',
            'condition.in' => 'Invalid condition. Must be one of: above, below, cross.',
            'price_level.min' => 'Price level must be greater than 0.',
            'price_level.max' => 'Price level must not exceed 10000.',
        ];
    }
}