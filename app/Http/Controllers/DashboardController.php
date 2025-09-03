<?php

namespace App\Http\Controllers;

use App\Http\Requests\Analytics\ClickDataRequest;
use App\Services\Matomo\MatomoClickDataService;
use App\Services\Matomo\MatomoDataTransformer;
use App\Services\Matomo\MatomoDeviceDataService;
use App\Services\Matomo\MatomoBrowserDataService;
use App\Services\Matomo\MatomoCpcDataService;
use App\Services\Matomo\MatomoCvrDataService;
use App\Services\Matomo\MatomoCpaDataService;
use App\Services\Matomo\MatomoCttDataService;
use App\Services\Matomo\MatomoCvtDataService;
use App\Services\Matomo\MatomoCtrDataService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private MatomoClickDataService $clickDataService,
        private MatomoDataTransformer $dataTransformer,
        private MatomoDeviceDataService $deviceDataService,
        private MatomoBrowserDataService $browserDataService,
        private MatomoCpcDataService $cpcDataService,
        private MatomoCvrDataService $cvrDataService,
        private MatomoCpaDataService $cpaDataService,
        private MatomoCttDataService $cttDataService,
        private MatomoCvtDataService $cvtDataService,
        private MatomoCtrDataService $ctrDataService
    ) {}

    /**
     * Display the dashboard with click analytics
     */
    public function index(Request $request): Response
    {
        // Check if custom date range is provided
        $startDate = $request->string('start_date')->toString() ?: null;
        $endDate = $request->string('end_date')->toString() ?: null;
        
        // If custom date range is provided, calculate period in days
        if ($startDate && $endDate) {
            $start = \Carbon\Carbon::parse($startDate);
            $end = \Carbon\Carbon::parse($endDate);
            $period = $start->diffInDays($end) + 1; // +1 to include both start and end dates
        } else {
            // Default to 7 days if no period specified
            $period = $request->integer('period', 7);
            // Validate period is one of allowed values
            $period = in_array($period, [7, 14, 30, 100]) ? $period : 7;
        }
        
        $trackingLinkId = $request->string('tracking_link_id')->toString() ?: null;

        // Get click data from Matomo service
        $rawData = $this->clickDataService->getClickData($period, $trackingLinkId);

        // Transform data for frontend consumption
        $chartData = $this->dataTransformer->transformForLineChart($rawData);
        
        // Get device type data
        $deviceData = $this->deviceDataService->getDeviceDataForChart($period);
        
        // Get browser type data
        $browserData = $this->browserDataService->getBrowserDataForChart($period);
        
        // Get CPC data
        $cpcData = $this->cpcDataService->getCpcData($period, $chartData['totalClicks']);
        
        // Get CVR data
        $cvrData = $this->cvrDataService->getCvrData($period, $chartData['totalClicks']);
        
        // Get CPA data (using ad spend from CPC data)
        $cpaData = $this->cpaDataService->getCpaData($period, $cvrData, $cpcData['ad_spend']);
        
        // Get CTT data
        $cttData = $this->cttDataService->getCttDataForChart($period);
        
        // Get CVT data
        $cvtData = $this->cvtDataService->getCvtDataForChart($period, $cvrData['total_conversions']);
        
        // Get CTR data (using mock impressions data for now)
        $mockImpressions = $this->getMockImpressions($chartData['totalClicks']);
        $ctrData = $this->ctrDataService->getCtrData($period, $chartData['totalClicks'], $mockImpressions);

        return Inertia::render('dashboard', [
            'clickAnalytics' => $chartData,
            'deviceAnalytics' => $deviceData,
            'browserAnalytics' => $browserData,
            'cpcAnalytics' => $cpcData,
            'cvrAnalytics' => $cvrData,
            'cpaAnalytics' => $cpaData,
            'cttAnalytics' => $cttData,
            'cvtAnalytics' => $cvtData,
            'ctrAnalytics' => $ctrData,
            'availablePeriods' => [
                ['value' => 7, 'label' => '7日間'],
                ['value' => 14, 'label' => '14日間'],
                ['value' => 30, 'label' => '30日間'],
                ['value' => 100, 'label' => '100日間'],
            ],
            'currentPeriod' => $period,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Get click data for AJAX requests (if needed for real-time updates)
     */
    public function getClickData(ClickDataRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        $rawData = $this->clickDataService->getClickData(
            $validated['period'],
            $validated['tracking_link_id'] ?? null
        );

        $chartData = $this->dataTransformer->transformForLineChart($rawData);

        return response()->json($chartData);
    }

    /**
     * Get aggregated data for multiple tracking links (for future use)
     */
    public function getAggregatedData(Request $request): \Illuminate\Http\JsonResponse
    {
        $period = $request->integer('period', 7);

        // Validate period
        $period = in_array($period, [7, 14, 30, 100]) ? $period : 7;

        // For prototype, just return single data set
        $rawData = $this->clickDataService->getClickData($period);
        $chartData = $this->dataTransformer->transformForLineChart($rawData);

        return response()->json([
            'period' => $period,
            'data' => $chartData
        ]);
    }
    
    /**
     * Generate mock impressions data for CTR calculation
     */
    private function getMockImpressions(int $clicks): int
    {
        // CTRが1-5%程度になるようにIMP数を生成
        $ctrRange = [0.01, 0.05]; // 1-5%
        $randomCtr = $ctrRange[0] + mt_rand() / mt_getrandmax() * ($ctrRange[1] - $ctrRange[0]);
        
        return intval($clicks / $randomCtr);
    }
}
