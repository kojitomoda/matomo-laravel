<?php

namespace App\Services\Matomo;

class MatomoDataTransformer
{
    /**
     * Transform raw Matomo data to chart-friendly format
     * 
     * @param array $matomoData Raw data from Matomo service
     * @return array Chart-ready data
     */
    public function transformForLineChart(array $matomoData): array
    {
        $chartData = [];
        
        foreach ($matomoData['data'] as $dayData) {
            $chartData[] = [
                'date' => $dayData['date'],
                'label' => $dayData['label'],
                'clicks' => $dayData['nb_clicks'],
                'uniqueVisitors' => $dayData['nb_uniq_visitors'],
                'bounceRate' => floatval(str_replace('%', '', $dayData['bounce_rate'])),
                'avgTimeOnSite' => $dayData['avg_time_on_site']
            ];
        }
        
        return [
            'period' => $matomoData['period'],
            'totalClicks' => $matomoData['total_clicks'],
            'trackingLinkId' => $matomoData['tracking_link_id'],
            'chartData' => $chartData,
            'summary' => $this->generateSummaryStats($chartData)
        ];
    }
    
    /**
     * Transform aggregated data for multiple tracking links
     * 
     * @param array $aggregatedData Data for multiple tracking links
     * @return array
     */
    public function transformAggregatedData(array $aggregatedData): array
    {
        $transformed = [];
        
        foreach ($aggregatedData as $linkId => $linkData) {
            $transformed[$linkId] = $this->transformForLineChart($linkData);
        }
        
        return $transformed;
    }
    
    /**
     * Generate summary statistics from chart data
     * 
     * @param array $chartData
     * @return array
     */
    private function generateSummaryStats(array $chartData): array
    {
        if (empty($chartData)) {
            return [
                'avgClicks' => 0,
                'maxClicks' => 0,
                'minClicks' => 0,
                'avgBounceRate' => 0,
                'trend' => 'stable'
            ];
        }
        
        $clicks = array_column($chartData, 'clicks');
        $bounceRates = array_column($chartData, 'bounceRate');
        
        // Calculate trend (comparing first half with second half)
        $halfPoint = intval(count($clicks) / 2);
        $firstHalfAvg = array_sum(array_slice($clicks, 0, $halfPoint)) / $halfPoint;
        $secondHalfAvg = array_sum(array_slice($clicks, $halfPoint)) / (count($clicks) - $halfPoint);
        
        $trendPercentage = (($secondHalfAvg - $firstHalfAvg) / $firstHalfAvg) * 100;
        
        return [
            'avgClicks' => round(array_sum($clicks) / count($clicks)),
            'maxClicks' => max($clicks),
            'minClicks' => min($clicks),
            'avgBounceRate' => round(array_sum($bounceRates) / count($bounceRates), 1),
            'trend' => $this->determineTrend($trendPercentage),
            'trendPercentage' => round($trendPercentage, 1)
        ];
    }
    
    /**
     * Determine trend based on percentage change
     * 
     * @param float $percentage
     * @return string
     */
    private function determineTrend(float $percentage): string
    {
        if ($percentage > 10) {
            return 'up';
        } elseif ($percentage < -10) {
            return 'down';
        } else {
            return 'stable';
        }
    }
    
    /**
     * Format data for export (CSV, JSON, etc.)
     * 
     * @param array $data
     * @param string $format
     * @return mixed
     */
    public function formatForExport(array $data, string $format = 'json')
    {
        switch ($format) {
            case 'csv':
                return $this->formatAsCsv($data);
            case 'json':
            default:
                return json_encode($data, JSON_PRETTY_PRINT);
        }
    }
    
    /**
     * Format data as CSV
     * 
     * @param array $data
     * @return string
     */
    private function formatAsCsv(array $data): string
    {
        if (empty($data['chartData'])) {
            return '';
        }
        
        $csv = "Date,Label,Clicks,Unique Visitors,Bounce Rate (%),Avg Time on Site\n";
        
        foreach ($data['chartData'] as $row) {
            $csv .= sprintf(
                "%s,%s,%d,%d,%.1f,%s\n",
                $row['date'],
                $row['label'],
                $row['clicks'],
                $row['uniqueVisitors'],
                $row['bounceRate'],
                $row['avgTimeOnSite']
            );
        }
        
        return $csv;
    }
}