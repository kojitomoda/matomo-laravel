<?php

namespace App\Services\Matomo;

class MatomoCvtDataService
{
    /**
     * CVT（Conversion Time Tracking）データを生成（横棒グラフ用）
     */
    public function getCvtDataForChart(int $days, int $totalConversions): array
    {
        $data = $this->generateCvtData($days, $totalConversions);
        
        return [
            'period' => $data['period'],
            'total_conversions' => $data['total_conversions'],
            'data' => $data['hourly_conversions']
        ];
    }

    /**
     * 時間帯別コンバージョンデータを生成
     */
    private function generateCvtData(int $days, int $totalConversions): array
    {
        // 時間帯別のコンバージョン分布パターン（2時間単位、6時〜24時）
        // CVはクリックより遅れて発生する傾向があるため、夕方〜夜にかけて高い
        $hourlyPatterns = [
            '06:00-08:00' => 0.025, // 朝：低い
            '08:00-10:00' => 0.055, // 朝の通勤時間：やや低い
            '10:00-12:00' => 0.095, // 午前中：増加
            '12:00-14:00' => 0.125, // 昼休み後：増加
            '14:00-16:00' => 0.145, // 午後：高い
            '16:00-18:00' => 0.165, // 夕方：最高
            '18:00-20:00' => 0.155, // 夜：高い
            '20:00-22:00' => 0.135, // 夜：やや高い
            '22:00-24:00' => 0.075, // 深夜：減少
            '00:00-02:00' => 0.015, // 深夜：低い
            '02:00-04:00' => 0.005, // 深夜：最低
            '04:00-06:00' => 0.005  // 早朝：最低
        ];
        
        // 各時間帯のコンバージョン数を計算
        $hourlyConversions = [];
        
        foreach ($hourlyPatterns as $timeRange => $ratio) {
            // 若干のランダム変動を追加（±20%）
            $variation = mt_rand(80, 120) / 100;
            $adjustedRatio = $ratio * $variation;
            
            $conversions = (int) round($totalConversions * $adjustedRatio);
            
            $hourlyConversions[] = [
                'time_range' => $timeRange,
                'hour_start' => (int) explode(':', $timeRange)[0],
                'conversions' => $conversions,
                'percentage' => round($adjustedRatio * 100, 1)
            ];
        }
        
        // 時間順にソート（6時から開始）
        usort($hourlyConversions, function ($a, $b) {
            return $a['hour_start'] - $b['hour_start'];
        });
        
        // 6時から24時、0時から6時の順に並び替え
        $orderedConversions = [];
        $before6am = [];
        
        foreach ($hourlyConversions as $item) {
            if ($item['hour_start'] < 6) {
                $before6am[] = $item;
            } else {
                $orderedConversions[] = $item;
            }
        }
        
        $hourlyConversions = array_merge($orderedConversions, $before6am);
        
        return [
            'period' => $days,
            'total_conversions' => array_sum(array_column($hourlyConversions, 'conversions')),
            'hourly_conversions' => $hourlyConversions
        ];
    }
}