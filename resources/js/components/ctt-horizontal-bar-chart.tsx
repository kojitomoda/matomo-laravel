import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type CttDataPoint } from '@/types';

interface CttHorizontalBarChartProps {
    data: CttDataPoint[];
    peakHour: string;
}

export function CttHorizontalBarChart({ data, peakHour }: CttHorizontalBarChartProps) {
    // 全時間帯を表示（2時間単位なので12個）
    const chartData = data;
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold">{data.time_range}</p>
                    <p className="text-sm text-muted-foreground">
                        {data.clicks.toLocaleString()}クリック ({data.percentage}%)
                    </p>
                    {data.time_range === peakHour && (
                        <p className="text-xs text-amber-600 font-medium">🏆 ピーク時間帯</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 60,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis 
                            type="number" 
                            tickFormatter={(value) => value.toLocaleString()}
                            fontSize={12}
                            hide
                        />
                        <YAxis 
                            type="category" 
                            dataKey="time_range" 
                            fontSize={11}
                            width={55}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fill: '#9ca3af' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar 
                            dataKey="clicks" 
                            fill="#3b82f6"
                            radius={5}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}