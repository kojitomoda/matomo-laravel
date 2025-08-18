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
        private MatomoCvtDataService $cvtDataService
    ) {}

    /**
     * Display the dashboard with click analytics
     */
    public function index(Request $request): Response
    {
        // Default to 7 days if no period specified
        $period = $request->integer('period', 7);
        $trackingLinkId = $request->string('tracking_link_id')->toString() ?: null;

        // Validate period is one of allowed values
        $period = in_array($period, [7, 14, 30, 100]) ? $period : 7;

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

        return Inertia::render('dashboard', [
            'clickAnalytics' => $chartData,
            'deviceAnalytics' => $deviceData,
            'browserAnalytics' => $browserData,
            'cpcAnalytics' => $cpcData,
            'cvrAnalytics' => $cvrData,
            'cpaAnalytics' => $cpaData,
            'cttAnalytics' => $cttData,
            'cvtAnalytics' => $cvtData,
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
}
