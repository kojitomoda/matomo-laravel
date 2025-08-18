import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDataPoint {
  date: string;
  label: string;
  clicks: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnSite: string;
}

interface ClickAnalyticsAreaChartProps {
  data: ChartDataPoint[];
  period: number;
}

export function ClickAnalyticsAreaChart({ data, period }: ClickAnalyticsAreaChartProps) {
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
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="uniqueVisitorsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="clicks"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#clicksGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="uniqueVisitors"
            stackId="2"
            stroke="#9ca3af"
            fill="url(#uniqueVisitorsGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}