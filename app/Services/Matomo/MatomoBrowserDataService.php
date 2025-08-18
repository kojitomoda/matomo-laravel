<?php

namespace App\Services\Matomo;

class MatomoBrowserDataService
{
    /**
     * ブラウザ別アクセスデータを生成（円グラフ用）
     */
    public function getBrowserDataForChart(int $days): array
    {
        $data = $this->generateBrowserData($days);
        
        return [
            'period' => $data['period'],
            'total' => $data['total_sessions'],
            'data' => array_map(function ($item) {
                return [
                    'name' => $item['browser'],
                    'value' => $item['sessions'],
                    'percentage' => $item['percentage'],
                    'fill' => $item['color']
                ];
            }, $data['browser_types'])
        ];
    }

    /**
     * ブラウザ別データを生成
     */
    private function generateBrowserData(int $days): array
    {
        // 期間に応じたベースセッション数を計算
        $baseSessionsPerDay = 150;
        $totalSessions = $baseSessionsPerDay * $days;
        
        // 期間による変動を追加
        $periodMultiplier = match (true) {
            $days <= 7 => 0.9,
            $days <= 14 => 1.0,
            $days <= 30 => 1.1,
            default => 1.2
        };
        
        $totalSessions = (int) round($totalSessions * $periodMultiplier);
        
        // ブラウザ別の現実的な分布（2024年統計ベース）
        $browserDistribution = [
            'Chrome' => ['percentage' => 65.2, 'color' => '#4285F4'],
            'Safari' => ['percentage' => 18.8, 'color' => '#006CFF'],
            'Edge' => ['percentage' => 5.4, 'color' => '#0078D4'],
            'Firefox' => ['percentage' => 4.9, 'color' => '#FF9500'],
            'Opera' => ['percentage' => 2.8, 'color' => '#FF1B2D'],
            'その他' => ['percentage' => 2.9, 'color' => '#6B7280']
        ];
        
        // 若干のランダム変動を追加
        $adjustedDistribution = [];
        $remainingPercentage = 100;
        $browserNames = array_keys($browserDistribution);
        
        foreach ($browserNames as $i => $browser) {
            if ($i === count($browserNames) - 1) {
                // 最後のブラウザは残りのパーセンテージを使用
                $percentage = $remainingPercentage;
            } else {
                $basePercentage = $browserDistribution[$browser]['percentage'];
                // ±10%の変動を追加
                $variation = mt_rand(-10, 10) / 100;
                $percentage = max(0, $basePercentage * (1 + $variation));
                $remainingPercentage -= $percentage;
            }
            
            $sessions = (int) round($totalSessions * ($percentage / 100));
            
            $adjustedDistribution[] = [
                'browser' => $browser,
                'sessions' => $sessions,
                'percentage' => round($percentage, 1),
                'color' => $browserDistribution[$browser]['color']
            ];
        }
        
        // セッション数でソート（降順）
        usort($adjustedDistribution, function ($a, $b) {
            return $b['sessions'] - $a['sessions'];
        });
        
        return [
            'period' => $days,
            'total_sessions' => array_sum(array_column($adjustedDistribution, 'sessions')),
            'browser_types' => $adjustedDistribution
        ];
    }
}