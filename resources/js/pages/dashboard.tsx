import { ClickAnalyticsAreaChart } from '@/components/click-analytics-area-chart';
import { BrowserPieChart } from '@/components/browser-pie-chart';
import { CpaAnalyticsCard } from '@/components/cpa-analytics-card';
import { CttHorizontalBarChart } from '@/components/ctt-horizontal-bar-chart';
import { CvtHorizontalBarChart } from '@/components/cvt-horizontal-bar-chart';
import { CvrAnalyticsCard } from '@/components/cvr-analytics-card';
import { DevicePieChart } from '@/components/device-pie-chart';
import { PeriodSelector } from '@/components/period-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClickAnalytics, type DeviceAnalytics, type BrowserAnalytics, type CpcAnalytics, type CvrAnalytics, type CpaAnalytics, type CttAnalytics, type CvtAnalytics, type PeriodOption } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    clickAnalytics: ClickAnalytics;
    deviceAnalytics: DeviceAnalytics;
    browserAnalytics: BrowserAnalytics;
    cpcAnalytics: CpcAnalytics;
    cvrAnalytics: CvrAnalytics;
    cpaAnalytics: CpaAnalytics;
    cttAnalytics: CttAnalytics;
    cvtAnalytics: CvtAnalytics;
    availablePeriods: PeriodOption[];
    currentPeriod: number;
}

export default function Dashboard() {
    const { clickAnalytics, deviceAnalytics, browserAnalytics, cpcAnalytics, cvrAnalytics, cpaAnalytics, cttAnalytics, cvtAnalytics, availablePeriods, currentPeriod } = usePage<DashboardProps>().props;
    
    // URLパラメータから測定URL名を取得
    const urlParams = new URLSearchParams(window.location.search);
    const trackingUrlName = urlParams.get('name') || null;

    const handlePeriodChange = (period: number) => {
        router.get('/dashboard', { period }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <ArrowUp className="h-4 w-4 text-green-600" />;
            case 'down':
                return <ArrowDown className="h-4 w-4 text-red-600" />;
            default:
                return <Minus className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    // CPCの場合、低い方が良いので色を逆転
    const getCpcTrendColor = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'text-green-600'; // CPCが下がった（良い）
            case 'down':
                return 'text-red-600';   // CPCが上がった（悪い）
            default:
                return 'text-gray-600';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Period Selector - Top Left */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {trackingUrlName ? trackingUrlName : 'ダッシュボード'}
                        </h1>
                    </div>
                    <PeriodSelector
                        periods={availablePeriods}
                        currentPeriod={currentPeriod}
                        onPeriodChange={handlePeriodChange}
                    />
                </div>
                {/* Summary Cards - Top Row */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">総クリック数</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clickAnalytics.totalClicks.toLocaleString()}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {getTrendIcon(clickAnalytics.summary.trend)}
                                <span className={`ml-1 ${getTrendColor(clickAnalytics.summary.trend)}`}>
                                    {Math.abs(clickAnalytics.summary.trendPercentage)}%
                                </span>
                                <span className="ml-1">前期比</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">クリック単価(CPC)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{cpcAnalytics.cpc_formatted}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                {getTrendIcon(cpcAnalytics.cpc_trend)}
                                <span className={`ml-1 ${getCpcTrendColor(cpcAnalytics.cpc_trend)}`}>
                                    {Math.abs(cpcAnalytics.cpc_change_percent)}%
                                </span>
                                <span className="ml-1">前期比</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CVR & CPA Cards - Bottom Row */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <CvrAnalyticsCard data={cvrAnalytics} />
                    <CpaAnalyticsCard data={cpaAnalytics} />
                </div>

                {/* Chart Section */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>クリック数推移</CardTitle>
                        <CardDescription>
                            過去{currentPeriod}日間のクリック数とユニーク訪問者数の推移
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClickAnalyticsAreaChart
                            data={clickAnalytics.chartData}
                            period={currentPeriod}
                        />
                    </CardContent>
                </Card>

                {/* CTT & CVT Analytics - Time Tracking */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    {/* CTT Analytics - Click Time Tracking */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>CTT（クリック時間帯分析）</CardTitle>
                            <CardDescription>
                                過去{currentPeriod}日間の時間帯別クリック数分布
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CttHorizontalBarChart
                                data={cttAnalytics.data}
                                peakHour={cttAnalytics.peak_hour}
                            />
                        </CardContent>
                    </Card>

                    {/* CVT Analytics - Conversion Time Tracking */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>CVT（成果時間帯分析）</CardTitle>
                            <CardDescription>
                                過去{currentPeriod}日間の時間帯別コンバージョン分布
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CvtHorizontalBarChart
                                data={cvtAnalytics.data}
                            />
                        </CardContent>
                    </Card>
                </div>


                {/* Device Analytics & Browser Analytics - Lower Section */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">デバイス別アクセス</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <DevicePieChart
                                data={deviceAnalytics.data}
                                total={deviceAnalytics.total}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ブラウザ別アクセス</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <BrowserPieChart
                                data={browserAnalytics.data}
                                total={browserAnalytics.total}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
