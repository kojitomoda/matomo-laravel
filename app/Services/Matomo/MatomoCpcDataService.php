<?php

namespace App\Services\Matomo;

class MatomoCpcDataService
{
    /**
     * Get CPC (Cost Per Click) data for the specified period
     * This is a mock service that returns fixed values for prototyping
     * 
     * @param int $days Number of days to retrieve
     * @param int $totalClicks Total clicks for the period
     * @return array
     */
    public function getCpcData(int $days, int $totalClicks): array
    {
        // Generate realistic ad spend based on period
        $adSpend = $this->getAdSpendForPeriod($days);
        
        // Calculate CPC
        $cpc = $totalClicks > 0 ? $adSpend / $totalClicks : 0;
        
        // Get previous period data for comparison
        $previousAdSpend = $this->getAdSpendForPeriod($days) * rand(85, 115) / 100;
        $previousClicks = max(1, intval($totalClicks * rand(85, 115) / 100));
        $previousCpc = $previousClicks > 0 ? $previousAdSpend / $previousClicks : 0;
        
        // Calculate trend
        $cpcChange = $cpc - $previousCpc;
        $cpcChangePercent = $previousCpc > 0 
            ? round(($cpcChange / $previousCpc) * 100, 1) 
            : 0;
        
        return [
            'period' => $days,
            'ad_spend' => $adSpend,
            'total_clicks' => $totalClicks,
            'cpc' => round($cpc, 2),
            'cpc_formatted' => '¥' . number_format($cpc, 0),
            'previous_cpc' => round($previousCpc, 2),
            'cpc_change' => round($cpcChange, 2),
            'cpc_change_percent' => $cpcChangePercent,
            'cpc_trend' => $this->determineTrend($cpcChangePercent),
            'budget_utilization' => $this->getBudgetUtilization($adSpend, $days),
            'average_position' => $this->getAveragePosition(),
            'quality_score' => $this->getQualityScore()
        ];
    }
    
    /**
     * Get ad spend based on period
     * 
     * @param int $days
     * @return float
     */
    private function getAdSpendForPeriod(int $days): float
    {
        $baseSpend = match($days) {
            7 => rand(50000, 100000),      // 5万〜10万円
            14 => rand(100000, 200000),    // 10万〜20万円
            30 => rand(200000, 500000),    // 20万〜50万円
            100 => rand(800000, 1500000),  // 80万〜150万円
            default => rand(50000, 100000)
        };
        
        // Add some variation
        $variation = rand(95, 105) / 100;
        
        return $baseSpend * $variation;
    }
    
    /**
     * Determine CPC trend direction
     * 
     * @param float $changePercent
     * @return string
     */
    private function determineTrend(float $changePercent): string
    {
        // For CPC, lower is better, so inverse the logic
        if ($changePercent < -5) {
            return 'up';  // Good trend (CPC decreased)
        } elseif ($changePercent > 5) {
            return 'down';  // Bad trend (CPC increased)
        } else {
            return 'stable';
        }
    }
    
    /**
     * Get budget utilization percentage
     * 
     * @param float $adSpend
     * @param int $days
     * @return array
     */
    private function getBudgetUtilization(float $adSpend, int $days): array
    {
        // Assume budget based on period
        $budget = match($days) {
            7 => 120000,     // 12万円
            14 => 250000,    // 25万円
            30 => 600000,    // 60万円
            100 => 2000000,  // 200万円
            default => 120000
        };
        
        $utilization = ($adSpend / $budget) * 100;
        
        return [
            'budget' => $budget,
            'spent' => $adSpend,
            'remaining' => $budget - $adSpend,
            'percentage' => round($utilization, 1)
        ];
    }
    
    /**
     * Get average ad position
     * 
     * @return float
     */
    private function getAveragePosition(): float
    {
        // Mock average position between 1.0 and 4.0
        return round(rand(10, 40) / 10, 1);
    }
    
    /**
     * Get quality score
     * 
     * @return int
     */
    private function getQualityScore(): int
    {
        // Mock quality score between 5 and 10
        return rand(5, 10);
    }
    
    /**
     * Get CPC breakdown by campaign type
     * 
     * @param int $days
     * @return array
     */
    public function getCpcBreakdown(int $days): array
    {
        $totalAdSpend = $this->getAdSpendForPeriod($days);
        
        return [
            'search' => [
                'name' => '検索広告',
                'spend' => $totalAdSpend * 0.6,
                'clicks' => rand(1000, 3000),
                'cpc' => round(($totalAdSpend * 0.6) / rand(1000, 3000), 2)
            ],
            'display' => [
                'name' => 'ディスプレイ広告',
                'spend' => $totalAdSpend * 0.3,
                'clicks' => rand(2000, 5000),
                'cpc' => round(($totalAdSpend * 0.3) / rand(2000, 5000), 2)
            ],
            'video' => [
                'name' => '動画広告',
                'spend' => $totalAdSpend * 0.1,
                'clicks' => rand(500, 1000),
                'cpc' => round(($totalAdSpend * 0.1) / rand(500, 1000), 2)
            ]
        ];
    }
}