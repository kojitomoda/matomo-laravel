import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';

interface CtrAnalyticsData {
    ctr_formatted: string;
    ctr_trend: string;
    ctr_change_percent: number;
    total_clicks: number;
    total_impressions: number;
}

interface CtrAnalyticsCardProps {
    data: CtrAnalyticsData;
}

export function CtrAnalyticsCard({ data }: CtrAnalyticsCardProps) {
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

    const hasImpressions = data.total_impressions > 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CTR（クリック率）</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {hasImpressions ? (
                    <>
                        <div className="text-2xl font-bold">{data.ctr_formatted}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {getTrendIcon(data.ctr_trend)}
                            <span className={`ml-1 ${getTrendColor(data.ctr_trend)}`}>
                                {Math.abs(data.ctr_change_percent)}%
                            </span>
                            <span className="ml-1">前期比</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            クリック数: {data.total_clicks.toLocaleString()} / IMP数: {data.total_impressions.toLocaleString()}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold text-muted-foreground">---%</div>
                        <div className="text-xs text-muted-foreground">
                            IMP入力が必要です
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            クリック数: {data.total_clicks.toLocaleString()} / IMP数: 未入力
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}