<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan_type' => ['required', 'string', Rule::in(['basic', 'pro', 'enterprise'])],
        ];
    }

    public function messages(): array
    {
        return [
            'plan_type.in' => 'Invalid plan. Must be one of: basic, pro, enterprise.',
        ];
    }
}