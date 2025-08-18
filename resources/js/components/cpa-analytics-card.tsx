import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
import { type CpaAnalytics } from '@/types';

interface CpaAnalyticsCardProps {
    data: CpaAnalytics;
}

export function CpaAnalyticsCard({ data }: CpaAnalyticsCardProps) {
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

    // CPAは低い方が良いので色を逆転
    const getCpaTrendColor = (trend: string) => {
        switch (trend) {
            case 'up':
                return 'text-green-600'; // CPA減少（良い）
            case 'down':
                return 'text-red-600';   // CPA増加（悪い）
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPA（獲得単価）</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">{data.total_cpa_formatted}</div>
                <div className="flex items-center text-xs text-muted-foreground mb-4">
                    {getTrendIcon(data.cpa_trend)}
                    <span className={`ml-1 ${getCpaTrendColor(data.cpa_trend)}`}>
                        {Math.abs(data.cpa_change_percent)}%
                    </span>
                    <span className="ml-1">前期比</span>
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                    広告費: {data.ad_spend.toLocaleString()}円 / CV数: {data.total_conversions.toLocaleString()}
                </div>
                
                {/* CV種別内訳 */}
                <div className="space-y-3 pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-2">CV種別内訳</div>
                    
                    {/* 購入完了 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{data.conversions_by_type.purchase.label}</span>
                                <span className="text-xs text-muted-foreground">{data.conversions_by_type.purchase.url}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold">{data.conversions_by_type.purchase.cpa_formatted}</div>
                            <div className="text-xs text-muted-foreground">{data.conversions_by_type.purchase.count}CV</div>
                        </div>
                    </div>
                    
                    {/* お問い合わせ */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{data.conversions_by_type.inquiry.label}</span>
                                <span className="text-xs text-muted-foreground">{data.conversions_by_type.inquiry.url}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold">{data.conversions_by_type.inquiry.cpa_formatted}</div>
                            <div className="text-xs text-muted-foreground">{data.conversions_by_type.inquiry.count}CV</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}