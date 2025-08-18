import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PeriodOption {
  value: number;
  label: string;
}

interface PeriodSelectorProps {
  periods: PeriodOption[];
  currentPeriod: number;
  onPeriodChange: (period: number) => void;
}

export function PeriodSelector({ periods, currentPeriod, onPeriodChange }: PeriodSelectorProps) {
  return (
    <Tabs
      value={currentPeriod.toString()}
      onValueChange={(value) => {
        onPeriodChange(parseInt(value));
      }}
    >
      <TabsList>
        {periods.map((period) => (
          <TabsTrigger
            key={period.value}
            value={period.value.toString()}
          >
            {period.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}