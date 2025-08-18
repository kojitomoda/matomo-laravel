<?php

namespace App\Services\Matomo;

class MatomoCvrDataService
{
    /**
     * CVRデータを生成
     */
    public function getCvrData(int $days, int $totalClicks): array
    {
        $conversions = $this->generateConversions($days, $totalClicks);
        $previousConversions = $this->generateConversions($days, $totalClicks, true);
        
        $totalCvr = $totalClicks > 0 ? ($conversions['total'] / $totalClicks) * 100 : 0;
        $previousCvr = $totalClicks > 0 ? ($previousConversions['total'] / $totalClicks) * 100 : 0;
        
        $cvrChange = $previousCvr > 0 ? (($totalCvr - $previousCvr) / $previousCvr) * 100 : 0;
        $cvrTrend = $this->determineTrend($cvrChange);
        
        return [
            'total_cvr' => round($totalCvr, 2),
            'total_cvr_formatted' => number_format($totalCvr, 2) . '%',
            'total_conversions' => $conversions['total'],
            'total_clicks' => $totalClicks,
            'cvr_trend' => $cvrTrend,
            'cvr_change_percent' => round(abs($cvrChange), 1),
            'conversions_by_type' => [
                'purchase' => [
                    'count' => $conversions['purchase'],
                    'cvr' => $totalClicks > 0 ? round(($conversions['purchase'] / $totalClicks) * 100, 2) : 0,
                    'url' => '/thanks',
                    'label' => '購入完了'
                ],
                'inquiry' => [
                    'count' => $conversions['inquiry'],
                    'cvr' => $totalClicks > 0 ? round(($conversions['inquiry'] / $totalClicks) * 100, 2) : 0,
                    'url' => '/complete',
                    'label' => 'お問い合わせ'
                ]
            ],
            'period' => $days
        ];
    }

    /**
     * コンバージョン数を生成
     */
    private function generateConversions(int $days, int $totalClicks, bool $isPrevious = false): array
    {
        // 基準CVRを設定（業界平均的な値）
        $baseCvrPercent = 2.5; // 2.5%の基準CVR
        
        // 期間による変動を追加
        $periodMultiplier = match (true) {
            $days <= 7 => $isPrevious ? 0.8 : 1.0,
            $days <= 14 => $isPrevious ? 0.9 : 1.1,
            $days <= 30 => $isPrevious ? 0.85 : 1.05,
            default => $isPrevious ? 0.9 : 1.0
        };
        
        // 若干のランダム要素を追加
        $randomFactor = mt_rand(85, 115) / 100;
        
        $targetCvr = ($baseCvrPercent / 100) * $periodMultiplier * $randomFactor;
        $totalConversions = (int) round($totalClicks * $targetCvr);
        
        // 購入とお問い合わせの割合（購入が多め）
        $purchaseRatio = 0.72; // 72%が購入
        $inquiryRatio = 0.28;  // 28%がお問い合わせ
        
        $purchaseConversions = (int) round($totalConversions * $purchaseRatio);
        $inquiryConversions = $totalConversions - $purchaseConversions;
        
        return [
            'total' => $totalConversions,
            'purchase' => $purchaseConversions,
            'inquiry' => $inquiryConversions
        ];
    }

    /**
     * トレンドを判定
     */
    private function determineTrend(float $changePercent): string
    {
        if ($changePercent > 0.5) {
            return 'up';
        } elseif ($changePercent < -0.5) {
            return 'down';
        }
        return 'stable';
    }
}