<?php

namespace App\Http\Requests\Analytics;

use Illuminate\Foundation\Http\FormRequest;

class ClickDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'period' => ['required', 'integer', 'in:7,14,30,100'],
            'tracking_link_id' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'period.required' => '期間の指定は必須です。',
            'period.in' => '期間は7、14、30、100日のいずれかを選択してください。',
            'tracking_link_id.max' => 'トラッキングリンクIDは255文字以内で入力してください。',
        ];
    }
}