<?php

namespace App\Services\Matomo;

class MatomoCpaDataService
{
    /**
     * CPA（獲得単価）データを生成
     */
    public function getCpaData(int $days, array $cvrData, float $adSpend): array
    {
        // CVRデータから総CV数と種別別CV数を取得
        $totalConversions = $cvrData['total_conversions'];
        $purchaseConversions = $cvrData['conversions_by_type']['purchase']['count'];
        $inquiryConversions = $cvrData['conversions_by_type']['inquiry']['count'];
        
        // CPAを計算
        $totalCpa = $totalConversions > 0 ? $adSpend / $totalConversions : 0;
        
        // 前期比計算用の前期データを生成
        $previousData = $this->generatePreviousPeriodData($days, $adSpend);
        $previousCpa = $previousData['cpa'];
        
        $cpaChange = $previousCpa > 0 ? (($totalCpa - $previousCpa) / $previousCpa) * 100 : 0;
        $cpaTrend = $this->determineTrend($cpaChange);
        
        // 種別別CPAを計算（種別ごとに広告費を按分）
        $purchaseCostRatio = 0.75; // 購入系に75%の予算配分
        $inquiryCostRatio = 0.25;  // お問い合わせ系に25%の予算配分
        
        $purchaseAdSpend = $adSpend * $purchaseCostRatio;
        $inquiryAdSpend = $adSpend * $inquiryCostRatio;
        
        $purchaseCpa = $purchaseConversions > 0 ? $purchaseAdSpend / $purchaseConversions : 0;
        $inquiryCpa = $inquiryConversions > 0 ? $inquiryAdSpend / $inquiryConversions : 0;
        
        return [
            'total_cpa' => round($totalCpa, 0),
            'total_cpa_formatted' => '¥' . number_format($totalCpa, 0),
            'total_conversions' => $totalConversions,
            'ad_spend' => $adSpend,
            'cpa_trend' => $cpaTrend,
            'cpa_change_percent' => round(abs($cpaChange), 1),
            'conversions_by_type' => [
                'purchase' => [
                    'count' => $purchaseConversions,
                    'cpa' => round($purchaseCpa, 0),
                    'cpa_formatted' => '¥' . number_format($purchaseCpa, 0),
                    'ad_spend' => $purchaseAdSpend,
                    'url' => '/thanks',
                    'label' => '購入完了'
                ],
                'inquiry' => [
                    'count' => $inquiryConversions,
                    'cpa' => round($inquiryCpa, 0),
                    'cpa_formatted' => '¥' . number_format($inquiryCpa, 0),
                    'ad_spend' => $inquiryAdSpend,
                    'url' => '/complete',
                    'label' => 'お問い合わせ'
                ]
            ],
            'period' => $days
        ];
    }

    /**
     * 前期データを生成
     */
    private function generatePreviousPeriodData(int $days, float $currentAdSpend): array
    {
        // 前期は若干異なる条件を想定
        $previousAdSpend = $currentAdSpend * mt_rand(90, 110) / 100;
        $previousConversions = mt_rand(80, 120); // 前期のCV数をランダム生成
        
        $previousCpa = $previousConversions > 0 ? $previousAdSpend / $previousConversions : 0;
        
        return [
            'ad_spend' => $previousAdSpend,
            'conversions' => $previousConversions,
            'cpa' => $previousCpa
        ];
    }

    /**
     * トレンドを判定（CPAは低い方が良いので、減少が良い傾向）
     */
    private function determineTrend(float $changePercent): string
    {
        if ($changePercent < -5) {
            return 'up';   // CPA減少は良い傾向
        } elseif ($changePercent > 5) {
            return 'down'; // CPA増加は悪い傾向
        }
        return 'stable';
    }
}