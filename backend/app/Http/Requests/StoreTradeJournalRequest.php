<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTradeJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'symbol' => ['required', 'string', Rule::in(['XAUUSD'])],
            'direction' => ['required', 'string', Rule::in(['long', 'short'])],
            'entry_price' => ['required', 'numeric', 'min:0'],
            'lot_size' => ['required', 'numeric', 'min:0.01', 'max:100'],
            'stop_loss' => ['nullable', 'numeric', 'min:0'],
            'take_profit' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $direction = $this->input('direction');
            $entryPrice = $this->input('entry_price');
            $stopLoss = $this->input('stop_loss');
            $takeProfit = $this->input('take_profit');

            if ($direction === 'long') {
                if ($stopLoss && $stopLoss >= $entryPrice) {
                    $validator->errors()->add('stop_loss', 'Stop loss must be below entry price for long positions.');
                }
                if ($takeProfit && $takeProfit <= $entryPrice) {
                    $validator->errors()->add('take_profit', 'Take profit must be above entry price for long positions.');
                }
            } elseif ($direction === 'short') {
                if ($stopLoss && $stopLoss <= $entryPrice) {
                    $validator->errors()->add('stop_loss', 'Stop loss must be above entry price for short positions.');
                }
                if ($takeProfit && $takeProfit >= $entryPrice) {
                    $validator->errors()->add('take_profit', 'Take profit must be below entry price for short positions.');
                }
            }
        });
    }
}