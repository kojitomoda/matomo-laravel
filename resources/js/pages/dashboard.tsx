import { ClickAnalyticsAreaChart } from '@/components/click-analytics-area-chart';
import { BrowserPieChart } from '@/components/browser-pie-chart';
import { CpaAnalyticsCard } from '@/components/cpa-analytics-card';
import { CttHorizontalBarChart } from '@/components/ctt-horizontal-bar-chart';
import { CvtHorizontalBarChart } from '@/components/cvt-horizontal-bar-chart';
import { CvrAnalyticsCard } from '@/components/cvr-analytics-card';
import { CtrAnalyticsCard } from '@/components/ctr-analytics-card';
import { DevicePieChart } from '@/components/device-pie-chart';
import { PeriodSelector } from '@/components/period-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ClickAnalytics, type DeviceAnalytics, type BrowserAnalytics, type CpcAnalytics, type CvrAnalytics, type CpaAnalytics, type CttAnalytics, type CvtAnalytics, type PeriodOption } from '@/types';

interface CtrAnalytics {
    ctr_formatted: string;
    ctr_trend: string;
    ctr_change_percent: number;
    total_clicks: number;
    total_impressions: number;
}
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'キャンペーン一覧',
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
    ctrAnalytics: CtrAnalytics;
    availablePeriods: PeriodOption[];
    currentPeriod: number;
}

export default function Dashboard() {
    const { clickAnalytics, deviceAnalytics, browserAnalytics, cpcAnalytics, cvrAnalytics, cpaAnalytics, cttAnalytics, cvtAnalytics, ctrAnalytics, availablePeriods, currentPeriod } = usePage<DashboardProps>().props;

    // URLパラメータから測定URL名とプロジェクトIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const trackingUrlName = urlParams.get('name') || null;
    const projectId = urlParams.get('project') || '1'; // デフォルトはCov

    // クエリパラメータがない場合はプロジェクト一覧表示
    const showProjectsTable = !trackingUrlName;

    // プロジェクト別キャンペーン指標のモックデータ
    const projectCampaignMetrics: Record<string, { project: string; campaigns: Array<{ name: string; imp: number; clicks: number; ctr: string; cv: number; cvr: string }> }> = {
        '1': { // Cov プロジェクト
            project: 'Cov',
            campaigns: [
                { name: 'Google検索広告_キーワード1', imp: 12500, clicks: 875, ctr: '7.0%', cv: 45, cvr: '5.1%' },
                { name: 'Meta広告_見込み顧客獲得', imp: 8300, clicks: 520, ctr: '6.3%', cv: 28, cvr: '5.4%' },
                { name: 'Yahoo!検索広告_ブランド名', imp: 5600, clicks: 380, ctr: '6.8%', cv: 22, cvr: '5.8%' },
                { name: 'Instagram広告_商品紹介', imp: 4200, clicks: 210, ctr: '5.0%', cv: 15, cvr: '7.1%' },
                { name: 'YouTube広告_動画宣伝', imp: 3800, clicks: 152, ctr: '4.0%', cv: 8, cvr: '5.3%' }
            ]
        },
        '2': { // 9ZLabo プロジェクト
            project: '9ZLabo',
            campaigns: [
                { name: 'X(Twitter)広告_認知拡大', imp: 9800, clicks: 490, ctr: '5.0%', cv: 35, cvr: '7.1%' },
                { name: 'LinkedIn広告_BtoB営業', imp: 6500, clicks: 455, ctr: '7.0%', cv: 42, cvr: '9.2%' },
                { name: 'TikTok広告_若年層向け', imp: 7200, clicks: 288, ctr: '4.0%', cv: 18, cvr: '6.3%' },
                { name: 'アフィリエイト_ASP経由', imp: 4800, clicks: 336, ctr: '7.0%', cv: 25, cvr: '7.4%' },
                { name: 'メール配信_既存顧客向け', imp: 2400, clicks: 192, ctr: '8.0%', cv: 24, cvr: '12.5%' },
                { name: 'リスティング広告_ブランド', imp: 5100, clicks: 357, ctr: '7.0%', cv: 30, cvr: '8.4%' },
                { name: 'ディスプレイ広告_リターゲティング', imp: 3600, clicks: 180, ctr: '5.0%', cv: 16, cvr: '8.9%' }
            ]
        },
        '3': { // Studioレジスタ プロジェクト
            project: 'Studioレジスタ',
            campaigns: [
                { name: 'Google広告_地域限定', imp: 4500, clicks: 270, ctr: '6.0%', cv: 20, cvr: '7.4%' },
                { name: 'Facebook広告_イベント集客', imp: 3200, clicks: 224, ctr: '7.0%', cv: 18, cvr: '8.0%' },
                { name: 'Instagram広告_サービス紹介', imp: 2800, clicks: 168, ctr: '6.0%', cv: 12, cvr: '7.1%' },
                { name: 'YouTube広告_実績動画', imp: 2100, clicks: 84, ctr: '4.0%', cv: 6, cvr: '7.1%' }
            ]
        },
        '4': { // Nobilista プロジェクト
            project: 'Nobilista',
            campaigns: [
                { name: 'SEOツール_リスティング', imp: 8700, clicks: 609, ctr: '7.0%', cv: 55, cvr: '9.0%' },
                { name: 'コンテンツマーケティング_記事', imp: 5400, clicks: 324, ctr: '6.0%', cv: 28, cvr: '8.6%' },
                { name: 'メルマガ_機能紹介', imp: 1800, clicks: 144, ctr: '8.0%', cv: 18, cvr: '12.5%' },
                { name: 'ウェビナー_集客広告', imp: 3600, clicks: 252, ctr: '7.0%', cv: 22, cvr: '8.7%' },
                { name: 'アフィリエイト_パートナー', imp: 2400, clicks: 144, ctr: '6.0%', cv: 12, cvr: '8.3%' }
            ]
        }
    };

    // プロジェクト別・期間別の指標データ
    const periodMetricsByProject: Record<string, Record<number, Array<{ name: string; imp: number; clicks: number; ctr: string; cv: number; cvr: string }>>> = {
        '1': { // Cov プロジェクト
            7: [ // 7日間
                { name: 'Google検索広告_キーワード1', imp: 3200, clicks: 224, ctr: '7.0%', cv: 11, cvr: '4.9%' },
                { name: 'Meta広告_見込み顧客獲得', imp: 2100, clicks: 147, ctr: '7.0%', cv: 8, cvr: '5.4%' },
                { name: 'Yahoo!検索広告_ブランド名', imp: 1400, clicks: 98, ctr: '7.0%', cv: 6, cvr: '6.1%' },
                { name: 'Instagram広告_商品紹介', imp: 1050, clicks: 53, ctr: '5.0%', cv: 4, cvr: '7.5%' },
                { name: 'YouTube広告_動画宣伝', imp: 950, clicks: 38, ctr: '4.0%', cv: 2, cvr: '5.3%' }
            ],
            14: [ // 14日間
                { name: 'Google検索広告_キーワード1', imp: 6000, clicks: 420, ctr: '7.0%', cv: 21, cvr: '5.0%' },
                { name: 'Meta広告_見込み顧客獲得', imp: 3900, clicks: 273, ctr: '7.0%', cv: 15, cvr: '5.5%' },
                { name: 'Yahoo!検索広告_ブランド名', imp: 2600, clicks: 182, ctr: '7.0%', cv: 11, cvr: '6.0%' },
                { name: 'Instagram広告_商品紹介', imp: 1950, clicks: 98, ctr: '5.0%', cv: 7, cvr: '7.1%' },
                { name: 'YouTube広告_動画宣伝', imp: 1750, clicks: 70, ctr: '4.0%', cv: 4, cvr: '5.7%' }
            ],
            30: [ // 30日間
                { name: 'Google検索広告_キーワード1', imp: 12500, clicks: 875, ctr: '7.0%', cv: 45, cvr: '5.1%' },
                { name: 'Meta広告_見込み顧客獲得', imp: 8300, clicks: 520, ctr: '6.3%', cv: 28, cvr: '5.4%' },
                { name: 'Yahoo!検索広告_ブランド名', imp: 5600, clicks: 380, ctr: '6.8%', cv: 22, cvr: '5.8%' },
                { name: 'Instagram広告_商品紹介', imp: 4200, clicks: 210, ctr: '5.0%', cv: 15, cvr: '7.1%' },
                { name: 'YouTube広告_動画宣伝', imp: 3800, clicks: 152, ctr: '4.0%', cv: 8, cvr: '5.3%' }
            ],
            100: [ // 100日間
                { name: 'Google検索広告_キーワード1', imp: 42000, clicks: 2940, ctr: '7.0%', cv: 153, cvr: '5.2%' },
                { name: 'Meta広告_見込み顧客獲得', imp: 28000, clicks: 1736, ctr: '6.2%', cv: 95, cvr: '5.5%' },
                { name: 'Yahoo!検索広告_ブランド名', imp: 18700, clicks: 1309, ctr: '7.0%', cv: 78, cvr: '6.0%' },
                { name: 'Instagram広告_商品紹介', imp: 14000, clicks: 700, ctr: '5.0%', cv: 52, cvr: '7.4%' },
                { name: 'YouTube広告_動画宣伝', imp: 12600, clicks: 504, ctr: '4.0%', cv: 27, cvr: '5.4%' }
            ]
        },
        '2': { // 9ZLabo プロジェクト
            7: [
                { name: 'X(Twitter)広告_認知拡大', imp: 2400, clicks: 120, ctr: '5.0%', cv: 9, cvr: '7.5%' },
                { name: 'LinkedIn広告_BtoB営業', imp: 1600, clicks: 112, ctr: '7.0%', cv: 11, cvr: '9.8%' },
                { name: 'TikTok広告_若年層向け', imp: 1800, clicks: 72, ctr: '4.0%', cv: 5, cvr: '6.9%' },
                { name: 'アフィリエイト_ASP経由', imp: 1200, clicks: 84, ctr: '7.0%', cv: 7, cvr: '8.3%' },
                { name: 'メール配信_既存顧客向け', imp: 600, clicks: 48, ctr: '8.0%', cv: 6, cvr: '12.5%' }
            ],
            30: [
                { name: 'X(Twitter)広告_認知拡大', imp: 9800, clicks: 490, ctr: '5.0%', cv: 35, cvr: '7.1%' },
                { name: 'LinkedIn広告_BtoB営業', imp: 6500, clicks: 455, ctr: '7.0%', cv: 42, cvr: '9.2%' },
                { name: 'TikTok広告_若年層向け', imp: 7200, clicks: 288, ctr: '4.0%', cv: 18, cvr: '6.3%' },
                { name: 'アフィリエイト_ASP経由', imp: 4800, clicks: 336, ctr: '7.0%', cv: 25, cvr: '7.4%' },
                { name: 'メール配信_既存顧客向け', imp: 2400, clicks: 192, ctr: '8.0%', cv: 24, cvr: '12.5%' }
            ]
        },
        '3': { // Studioレジスタ プロジェクト
            30: [
                { name: 'Google広告_地域限定', imp: 4500, clicks: 270, ctr: '6.0%', cv: 20, cvr: '7.4%' },
                { name: 'Facebook広告_イベント集客', imp: 3200, clicks: 224, ctr: '7.0%', cv: 18, cvr: '8.0%' },
                { name: 'Instagram広告_サービス紹介', imp: 2800, clicks: 168, ctr: '6.0%', cv: 12, cvr: '7.1%' },
                { name: 'YouTube広告_実績動画', imp: 2100, clicks: 84, ctr: '4.0%', cv: 6, cvr: '7.1%' }
            ]
        },
        '4': { // Nobilista プロジェクト
            30: [
                { name: 'SEOツール_リスティング', imp: 8700, clicks: 609, ctr: '7.0%', cv: 55, cvr: '9.0%' },
                { name: 'コンテンツマーケティング_記事', imp: 5400, clicks: 324, ctr: '6.0%', cv: 28, cvr: '8.6%' },
                { name: 'メルマガ_機能紹介', imp: 1800, clicks: 144, ctr: '8.0%', cv: 18, cvr: '12.5%' },
                { name: 'ウェビナー_集客広告', imp: 3600, clicks: 252, ctr: '7.0%', cv: 22, cvr: '8.7%' },
                { name: 'アフィリエイト_パートナー', imp: 2400, clicks: 144, ctr: '6.0%', cv: 12, cvr: '8.3%' }
            ]
        }
    };

    // 選択されたプロジェクトと期間に応じた指標データを取得
    const projectPeriodData = periodMetricsByProject[projectId] || periodMetricsByProject['1'];
    const currentCampaigns = projectPeriodData[currentPeriod] || projectPeriodData[30] || projectPeriodData[Object.keys(projectPeriodData)[0]];

    // 選択されたプロジェクトの情報を取得
    const selectedProjectInfo = projectCampaignMetrics[projectId] || projectCampaignMetrics['1'];
    const selectedProjectData = {
        project: selectedProjectInfo.project,
        campaigns: currentCampaigns
    };

    const handlePeriodChange = (period: number) => {
        router.get('/dashboard', { period }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDateRangeChange = (startDate: string, endDate: string) => {
        router.get('/dashboard', {
            start_date: startDate,
            end_date: endDate
        }, {
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
                            {trackingUrlName ? trackingUrlName : selectedProjectData?.project}
                        </h1>
                    </div>
                    <PeriodSelector
                        periods={availablePeriods}
                        currentPeriod={currentPeriod}
                        onPeriodChange={handlePeriodChange}
                        onDateRangeChange={handleDateRangeChange}
                        trackingUrlName={trackingUrlName}
                    />
                </div>

                {/* プロジェクト別キャンペーン指標テーブル */}
                {showProjectsTable && selectedProjectData && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{selectedProjectData.project}</CardTitle>
                                <CardDescription>
                                    キャンペーン指標一覧
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>キャンペーン名</TableHead>
                                            <TableHead className="text-right">表示回数(IMP)</TableHead>
                                            <TableHead className="text-right">クリック数</TableHead>
                                            <TableHead className="text-right">クリック率(CTR)</TableHead>
                                            <TableHead className="text-right">成果(CV数)</TableHead>
                                            <TableHead className="text-right">成果率(CVR)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedProjectData.campaigns.map((campaign, campaignIndex) => {
                                            // プロジェクトに応じたベースIDを設定
                                            const baseId = projectId === '1' ? 0 : 
                                                          projectId === '2' ? 5 :
                                                          projectId === '3' ? 13 :
                                                          projectId === '4' ? 16 : 0;
                                            const trackingUrlId = baseId + campaignIndex + 1;
                                            
                                            return (
                                                <TableRow key={campaignIndex}>
                                                    <TableCell className="font-medium">
                                                        <button
                                                            onClick={() => router.get('/dashboard', {
                                                                name: campaign.name,
                                                                tracking_url: trackingUrlId
                                                            })}
                                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left w-full"
                                                        >
                                                            {campaign.name}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-right">{campaign.imp.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right">{campaign.ctr}</TableCell>
                                                    <TableCell className="text-right">{campaign.cv}</TableCell>
                                                    <TableCell className="text-right">{campaign.cvr}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 従来のグラフ表示（クエリパラメータありの場合） */}
                {!showProjectsTable && (
                    <>
                        {/* Summary Cards - Top Row */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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

                    <CtrAnalyticsCard data={ctrAnalytics} />
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
                    </>
                )}
            </div>
        </AppLayout>
    );
}
