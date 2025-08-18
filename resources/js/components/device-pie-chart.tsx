import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceData {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

interface DevicePieChartProps {
  data: DeviceData[];
  total: number;
}

export function DevicePieChart({ data, total }: DevicePieChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return [`${value.toLocaleString()}セッション (${percentage}%)`, name];
  };

  const renderCustomLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  const renderLegend = (props: any) => {
    return (
      <ul className="flex flex-wrap justify-center gap-4 text-sm">
        {props.payload?.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-muted-foreground">
              {entry.value}: {data[index]?.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
          <Legend 
            content={renderLegend}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}