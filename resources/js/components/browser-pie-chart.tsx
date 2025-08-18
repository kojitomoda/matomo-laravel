import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type BrowserDataPoint } from '@/types';

interface BrowserPieChartProps {
    data: BrowserDataPoint[];
    total: number;
}

export function BrowserPieChart({ data, total }: BrowserPieChartProps) {
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="12"
                fontWeight="500"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {data.value.toLocaleString()}セッション ({data.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}