<?php

namespace App\Services\Matomo;

class MatomoCtrDataService
{
    /**
     * Get CTR data for dashboard
     */
    public function getCtrData(int $period, int $totalClicks, int $totalImpressions = 0): array
    {
        // CTR計算 (クリック数 ÷ IMP数 × 100)
        $ctr = $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0;
        
        // 前期比較用のモックデータ
        $previousClicks = $this->getPreviousClicks($totalClicks);
        $previousImpressions = $this->getPreviousImpressions($totalImpressions);
        $previousCtr = $previousImpressions > 0 ? ($previousClicks / $previousImpressions) * 100 : 0;
        
        // トレンド計算
        $ctrChange = $previousCtr > 0 ? (($ctr - $previousCtr) / $previousCtr) * 100 : 0;
        $trend = $ctrChange > 0 ? 'up' : ($ctrChange < 0 ? 'down' : 'flat');

        return [
            'ctr_formatted' => number_format($ctr, 2) . '%',
            'ctr_trend' => $trend,
            'ctr_change_percent' => round(abs($ctrChange), 1),
            'total_clicks' => $totalClicks,
            'total_impressions' => $totalImpressions,
            'raw_ctr' => $ctr,
        ];
    }

    /**
     * 前期のクリック数を取得（モック）
     */
    private function getPreviousClicks(int $currentClicks): int
    {
        // 前期比較用のランダムなデータ
        return intval($currentClicks * (0.8 + mt_rand() / mt_getrandmax() * 0.4));
    }

    /**
     * 前期のIMP数を取得（モック）
     */
    private function getPreviousImpressions(int $currentImpressions): int
    {
        if ($currentImpressions === 0) {
            return 0;
        }
        
        // 前期比較用のランダムなデータ
        return intval($currentImpressions * (0.8 + mt_rand() / mt_getrandmax() * 0.4));
    }
}