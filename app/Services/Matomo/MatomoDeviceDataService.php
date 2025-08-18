<?php

namespace App\Services\Matomo;

class MatomoDeviceDataService
{
    /**
     * Get device type data for the specified period
     * This is a mock service that returns fixed values for prototyping
     * 
     * @param int $days Number of days to retrieve (7, 14, 30, or 100)
     * @return array
     */
    public function getDeviceTypeData(int $days): array
    {
        // Generate realistic device distribution based on period
        $baseData = $this->getBaseDeviceDistribution($days);
        
        // Add some variation based on period
        $variation = $this->getPeriodVariation($days);
        
        $smartphone = max(1, intval($baseData['smartphone'] * $variation['smartphone']));
        $tablet = max(1, intval($baseData['tablet'] * $variation['tablet']));
        $pc = max(1, intval($baseData['pc'] * $variation['pc']));
        
        $total = $smartphone + $tablet + $pc;
        
        return [
            'period' => $days,
            'total_sessions' => $total,
            'device_types' => [
                [
                    'device' => 'スマホ',
                    'sessions' => $smartphone,
                    'percentage' => round(($smartphone / $total) * 100, 1),
                    'color' => '#3b82f6' // Blue
                ],
                [
                    'device' => 'タブレット',
                    'sessions' => $tablet,
                    'percentage' => round(($tablet / $total) * 100, 1),
                    'color' => '#10b981' // Green
                ],
                [
                    'device' => 'PC',
                    'sessions' => $pc,
                    'percentage' => round(($pc / $total) * 100, 1),
                    'color' => '#9ca3af' // Gray
                ]
            ]
        ];
    }
    
    /**
     * Get device type breakdown for multiple periods (comparison)
     * 
     * @param array $periods Array of period days
     * @return array
     */
    public function getDeviceTypeComparison(array $periods): array
    {
        $comparison = [];
        
        foreach ($periods as $period) {
            $comparison[$period] = $this->getDeviceTypeData($period);
        }
        
        return $comparison;
    }
    
    /**
     * Get base device distribution
     * Different periods may have slightly different device preferences
     * 
     * @param int $days
     * @return array
     */
    private function getBaseDeviceDistribution(int $days): array
    {
        return match($days) {
            7 => [
                'smartphone' => rand(600, 800), // 60-70%
                'tablet' => rand(100, 150),     // 10-15%
                'pc' => rand(200, 300)          // 20-25%
            ],
            14 => [
                'smartphone' => rand(1200, 1500), // 60-65%
                'tablet' => rand(200, 300),       // 10-15%
                'pc' => rand(400, 600)            // 20-25%
            ],
            30 => [
                'smartphone' => rand(2400, 3000), // 60-65%
                'tablet' => rand(400, 600),       // 10-15%
                'pc' => rand(800, 1200)           // 20-25%
            ],
            100 => [
                'smartphone' => rand(8000, 10000), // 60-65%
                'tablet' => rand(1300, 1700),      // 10-15%
                'pc' => rand(2600, 4000)           // 20-25%
            ],
            default => [
                'smartphone' => rand(600, 800),
                'tablet' => rand(100, 150),
                'pc' => rand(200, 300)
            ]
        };
    }
    
    /**
     * Get period-based variation
     * Longer periods might show different device usage patterns
     * 
     * @param int $days
     * @return array
     */
    private function getPeriodVariation(int $days): array
    {
        // Slight variations to make data realistic
        return [
            'smartphone' => rand(95, 105) / 100, // ±5%
            'tablet' => rand(90, 110) / 100,     // ±10%
            'pc' => rand(95, 105) / 100          // ±5%
        ];
    }
    
    /**
     * Get device type trends over time
     * 
     * @param int $days
     * @return array
     */
    public function getDeviceTypeTrends(int $days): array
    {
        $currentData = $this->getDeviceTypeData($days);
        $previousData = $this->getDeviceTypeData($days); // Mock previous period
        
        $trends = [];
        
        foreach ($currentData['device_types'] as $index => $current) {
            $previous = $previousData['device_types'][$index];
            
            $change = $current['sessions'] - $previous['sessions'];
            $changePercent = $previous['sessions'] > 0 
                ? round(($change / $previous['sessions']) * 100, 1) 
                : 0;
            
            $trends[] = [
                'device' => $current['device'],
                'current_sessions' => $current['sessions'],
                'previous_sessions' => $previous['sessions'],
                'change' => $change,
                'change_percent' => $changePercent,
                'trend' => $this->determineTrend($changePercent)
            ];
        }
        
        return [
            'period' => $days,
            'trends' => $trends
        ];
    }
    
    /**
     * Determine trend direction
     * 
     * @param float $changePercent
     * @return string
     */
    private function determineTrend(float $changePercent): string
    {
        if ($changePercent > 5) {
            return 'up';
        } elseif ($changePercent < -5) {
            return 'down';
        } else {
            return 'stable';
        }
    }
    
    /**
     * Get device type data for chart consumption
     * Optimized format for React charts
     * 
     * @param int $days
     * @return array
     */
    public function getDeviceDataForChart(int $days): array
    {
        $data = $this->getDeviceTypeData($days);
        
        return [
            'period' => $data['period'],
            'total' => $data['total_sessions'],
            'data' => array_map(function ($item) {
                return [
                    'name' => $item['device'],
                    'value' => $item['sessions'],
                    'percentage' => $item['percentage'],
                    'fill' => $item['color']
                ];
            }, $data['device_types'])
        ];
    }
}