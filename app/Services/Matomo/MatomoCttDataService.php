<?php

namespace App\Services\Matomo;

class MatomoCttDataService
{
    /**
     * CTT（Click Time Tracking）データを生成（横棒グラフ用）
     */
    public function getCttDataForChart(int $days): array
    {
        $data = $this->generateCttData($days);
        
        return [
            'period' => $data['period'],
            'total_clicks' => $data['total_clicks'],
            'peak_hour' => $data['peak_hour'],
            'data' => $data['hourly_clicks']
        ];
    }

    /**
     * 時間帯別クリックデータを生成
     */
    private function generateCttData(int $days): array
    {
        // 期間に応じたベースクリック数を計算
        $baseClicksPerDay = 200;
        $totalClicks = $baseClicksPerDay * $days;
        
        // 期間による変動を追加
        $periodMultiplier = match (true) {
            $days <= 7 => 0.8,
            $days <= 14 => 1.0,
            $days <= 30 => 1.2,
            default => 1.5
        };
        
        $totalClicks = (int) round($totalClicks * $periodMultiplier);
        
        // 時間帯別の現実的な分布パターン（2時間単位、6時〜24時）
        $hourlyPatterns = [
            '06:00-08:00' => 0.055, // 朝：徐々に増加
            '08:00-10:00' => 0.125, // 朝の通勤時間：高い
            '10:00-12:00' => 0.155, // 午前中：高い
            '12:00-14:00' => 0.165, // 昼休み：最高ピーク
            '14:00-16:00' => 0.115, // 午後：やや高い
            '16:00-18:00' => 0.095, // 夕方：減少
            '18:00-20:00' => 0.090, // 夜：やや減少
            '20:00-22:00' => 0.115, // 夜：再び増加
            '22:00-24:00' => 0.065, // 深夜：低下
            '00:00-02:00' => 0.025, // 深夜：低い
            '02:00-04:00' => 0.013, // 深夜：最低
            '04:00-06:00' => 0.013  // 早朝：最低
        ];
        
        // 各時間帯のクリック数を計算
        $hourlyClicks = [];
        $maxClicks = 0;
        $peakHour = '';
        
        foreach ($hourlyPatterns as $timeRange => $ratio) {
            // 若干のランダム変動を追加（±15%）
            $variation = mt_rand(85, 115) / 100;
            $adjustedRatio = $ratio * $variation;
            
            $clicks = (int) round($totalClicks * $adjustedRatio);
            
            if ($clicks > $maxClicks) {
                $maxClicks = $clicks;
                $peakHour = $timeRange;
            }
            
            $hourlyClicks[] = [
                'time_range' => $timeRange,
                'hour_start' => (int) explode(':', $timeRange)[0],
                'clicks' => $clicks,
                'percentage' => round($adjustedRatio * 100, 1)
            ];
        }
        
        // 時間順にソート（6時から開始）
        usort($hourlyClicks, function ($a, $b) {
            return $a['hour_start'] - $b['hour_start'];
        });
        
        // 6時から24時、0時から6時の順に並び替え
        $orderedClicks = [];
        $before6am = [];
        
        foreach ($hourlyClicks as $item) {
            if ($item['hour_start'] < 6) {
                $before6am[] = $item;
            } else {
                $orderedClicks[] = $item;
            }
        }
        
        $hourlyClicks = array_merge($orderedClicks, $before6am);
        
        return [
            'period' => $days,
            'total_clicks' => array_sum(array_column($hourlyClicks, 'clicks')),
            'peak_hour' => $peakHour,
            'hourly_clicks' => $hourlyClicks
        ];
    }
}