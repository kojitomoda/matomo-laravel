import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDataPoint {
  date: string;
  label: string;
  clicks: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnSite: string;
}

interface ClickAnalyticsChartProps {
  data: ChartDataPoint[];
  period: number;
}

export function ClickAnalyticsChart({ data, period }: ClickAnalyticsChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    switch (name) {
      case 'clicks':
        return [`${value.toLocaleString()}回`, 'クリック数'];
      case 'uniqueVisitors':
        return [`${value.toLocaleString()}人`, 'ユニーク訪問者'];
      default:
        return [value, name];
    }
  };

  const formatTooltipLabel = (label: string, payload: any[]) => {
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return `${data.date} (${data.label})`;
    }
    return label;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="uniqueVisitors"
            stroke="#9ca3af"
            strokeWidth={2}
            dot={{ fill: '#9ca3af', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#9ca3af', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}