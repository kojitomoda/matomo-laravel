<?php

namespace App\Services\Matomo;

use Carbon\Carbon;

class MatomoClickDataService
{
    /**
     * Get click data for the specified period
     * This is a mock service that returns fixed values for prototyping
     * 
     * @param int $days Number of days to retrieve (7, 14, 30, or 100)
     * @param string|null $trackingLinkId Optional tracking link ID to filter by
     * @return array
     */
    public function getClickData(int $days, ?string $trackingLinkId = null): array
    {
        // Generate date range
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();
        
        // Generate mock data based on the period
        $data = [];
        $currentDate = clone $startDate;
        
        while ($currentDate <= $endDate) {
            // Generate realistic click counts with some variation
            $baseClicks = $this->getBaseClicksForPeriod($days);
            $variation = $this->getVariation($currentDate);
            $clicks = max(0, intval($baseClicks * $variation));
            
            $data[] = [
                'date' => $currentDate->format('Y-m-d'),
                'label' => $this->formatDateLabel($currentDate, $days),
                'nb_clicks' => $clicks,
                'nb_uniq_visitors' => intval($clicks * 0.45), // Unique visitors are 45% of clicks
                'bounce_rate' => number_format(rand(30, 70), 1) . '%',
                'avg_time_on_site' => $this->formatTime(rand(60, 300))
            ];
            
            $currentDate->addDay();
        }
        
        return [
            'period' => $days,
            'tracking_link_id' => $trackingLinkId,
            'total_clicks' => array_sum(array_column($data, 'nb_clicks')),
            'data' => $data
        ];
    }
    
    /**
     * Get aggregated click statistics for multiple tracking links
     * 
     * @param int $days Number of days to retrieve
     * @param array $trackingLinkIds Array of tracking link IDs
     * @return array
     */
    public function getAggregatedClickData(int $days, array $trackingLinkIds): array
    {
        $aggregatedData = [];
        
        foreach ($trackingLinkIds as $linkId) {
            $linkData = $this->getClickData($days, $linkId);
            
            // Mock different performance for different links
            $performanceMultiplier = $this->getLinkPerformanceMultiplier($linkId);
            
            foreach ($linkData['data'] as &$dayData) {
                $dayData['nb_clicks'] = intval($dayData['nb_clicks'] * $performanceMultiplier);
                $dayData['nb_uniq_visitors'] = intval($dayData['nb_uniq_visitors'] * $performanceMultiplier);
            }
            
            $aggregatedData[$linkId] = $linkData;
        }
        
        return $aggregatedData;
    }
    
    /**
     * Get base clicks depending on the period
     * Longer periods have higher average clicks
     * 
     * @param int $days
     * @return int
     */
    private function getBaseClicksForPeriod(int $days): int
    {
        return match($days) {
            7 => rand(150, 250),
            14 => rand(180, 280),
            30 => rand(200, 300),
            100 => rand(250, 350),
            default => rand(150, 250)
        };
    }
    
    /**
     * Get variation based on day of week and time
     * Simulates realistic traffic patterns
     * 
     * @param Carbon $date
     * @return float
     */
    private function getVariation(Carbon $date): float
    {
        $dayOfWeek = $date->dayOfWeek;
        
        // Weekend traffic is typically lower
        if ($dayOfWeek === 0 || $dayOfWeek === 6) {
            return rand(60, 80) / 100;
        }
        
        // Weekday traffic with some variation
        return rand(90, 110) / 100;
    }
    
    /**
     * Format date label based on period
     * 
     * @param Carbon $date
     * @param int $days
     * @return string
     */
    private function formatDateLabel(Carbon $date, int $days): string
    {
        if ($days === 1) {
            return $date->format('H:00'); // Hourly for 1 day
        } elseif ($days <= 7) {
            return $date->format('M d'); // Month Day for week
        } else {
            return $date->format('m/d'); // MM/DD for longer periods
        }
    }
    
    /**
     * Format seconds to readable time
     * 
     * @param int $seconds
     * @return string
     */
    private function formatTime(int $seconds): string
    {
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        
        return sprintf('%d:%02d', $minutes, $remainingSeconds);
    }
    
    /**
     * Get performance multiplier for different tracking links
     * Simulates different performance levels
     * 
     * @param string $linkId
     * @return float
     */
    private function getLinkPerformanceMultiplier(string $linkId): float
    {
        // Use hash of link ID to generate consistent multiplier
        $hash = crc32($linkId);
        $normalized = ($hash % 100) / 100;
        
        // Return value between 0.5 and 1.5
        return 0.5 + $normalized;
    }
}