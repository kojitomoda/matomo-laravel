import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ImpInputModal } from './imp-input-modal';

interface PeriodOption {
  value: number;
  label: string;
}

interface PeriodSelectorProps {
  periods: PeriodOption[];
  currentPeriod: number;
  onPeriodChange: (period: number) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  trackingUrlName?: string | null;
}

export function PeriodSelector({ periods, currentPeriod, onPeriodChange, onDateRangeChange, trackingUrlName }: PeriodSelectorProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isImpModalOpen, setIsImpModalOpen] = useState(false);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleApplyDateRange = () => {
    if (dateRange?.from && dateRange?.to && onDateRangeChange) {
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      onDateRangeChange(startDate, endDate);
      setIsCalendarOpen(false);
    }
  };

  const getDateRangeText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MM/dd', { locale: ja })} - ${format(dateRange.to, 'MM/dd', { locale: ja })}`;
    }
    return '';
  };

  return (
    <div className="flex items-center gap-2">
      <Tabs
        value={currentPeriod.toString()}
        onValueChange={(value) => {
          onPeriodChange(parseInt(value));
          // 定期選択時はカスタム期間をリセット
          setDateRange(undefined);
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

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4" />
            {getDateRangeText() || '期間指定'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
              locale={ja}
              className="rounded-md border"
            />
            <div className="flex justify-end mt-3">
              <Button
                onClick={handleApplyDateRange}
                disabled={!dateRange?.from || !dateRange?.to}
                size="sm"
              >
                適用する
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {trackingUrlName && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsImpModalOpen(true)}
        >
          <BarChart3 className="h-4 w-4" />
          IMP入力
        </Button>
      )}

      <ImpInputModal
        open={isImpModalOpen}
        onOpenChange={setIsImpModalOpen}
        trackingUrlName={trackingUrlName}
      />
    </div>
  );
}
