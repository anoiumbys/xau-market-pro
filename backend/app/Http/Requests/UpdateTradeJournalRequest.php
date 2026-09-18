<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTradeJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'exit_price' => ['nullable', 'numeric', 'min:0'],
            'lot_size' => ['sometimes', 'numeric', 'min:0.01', 'max:100'],
            'stop_loss' => ['nullable', 'numeric', 'min:0'],
            'take_profit' => ['nullable', 'numeric', 'min:0'],
            'status' => ['sometimes', 'string', Rule::in(['open', 'closed', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $trade = $this->route('journal');
            $direction = $trade->direction;
            $entryPrice = $trade->entry_price;
            $exitPrice = $this->input('exit_price');
            $stopLoss = $this->input('stop_loss', $trade->stop_loss);
            $takeProfit = $this->input('take_profit', $trade->take_profit);

            if ($exitPrice && $direction === 'long') {
                if ($stopLoss && $stopLoss >= $entryPrice) {
                    $validator->errors()->add('stop_loss', 'Stop loss must be below entry price for long positions.');
                }
                if ($takeProfit && $takeProfit <= $entryPrice) {
                    $validator->errors()->add('take_profit', 'Take profit must be above entry price for long positions.');
                }
            } elseif ($exitPrice && $direction === 'short') {
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