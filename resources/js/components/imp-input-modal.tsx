import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ImpInputModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trackingUrlName?: string | null;
}

interface DayImpression {
    date: string;
    impressions: number | null;
}

export function ImpInputModal({ open, onOpenChange, trackingUrlName }: ImpInputModalProps) {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [impressions, setImpressions] = useState<Record<string, number>>({});

    // 選択月の全日付を生成
    const monthDays = eachDayOfInterval({
        start: startOfMonth(selectedMonth),
        end: endOfMonth(selectedMonth)
    });

    const handleDayClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const currentValue = impressions[dateStr] || '';
        const newValue = prompt(`${format(date, 'M月d日', { locale: ja })}のIMP数を入力してください`, currentValue.toString());
        
        if (newValue !== null) {
            const numValue = parseInt(newValue) || 0;
            setImpressions(prev => ({
                ...prev,
                [dateStr]: numValue
            }));
        }
    };

    const getStatusIcon = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const impValue = impressions[dateStr];
        
        if (impValue === undefined) return '[ ]';
        if (impValue === 0) return '[?]';
        return '[✓]';
    };

    const formatImpressions = (value: number) => {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toString();
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>IMP入力管理 - {trackingUrlName || '測定URL'}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* 月選択 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm">月選択:</span>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                        >
                            ←
                        </Button>
                        <span className="font-medium">
                            {format(selectedMonth, 'yyyy年M月', { locale: ja })}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                        >
                            →
                        </Button>
                    </div>

                    {/* カレンダー表示 */}
                    <div className="border rounded-lg p-4">
                        <div className="text-center mb-4 font-medium">
                            {format(selectedMonth, 'yyyy年 M月', { locale: ja })}
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2">
                            <div className="font-medium text-red-600">日</div>
                            <div className="font-medium">月</div>
                            <div className="font-medium">火</div>
                            <div className="font-medium">水</div>
                            <div className="font-medium">木</div>
                            <div className="font-medium">金</div>
                            <div className="font-medium text-blue-600">土</div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {/* 月初の空白セルを追加 */}
                            {Array.from({ length: startOfMonth(selectedMonth).getDay() }, (_, i) => (
                                <div key={`empty-start-${i}`} className="h-16"></div>
                            ))}
                            
                            {monthDays.map((date) => {
                                const dateStr = format(date, 'yyyy-MM-dd');
                                const impValue = impressions[dateStr];
                                const statusIcon = getStatusIcon(date);
                                
                                return (
                                    <div
                                        key={dateStr}
                                        className="h-16 border rounded cursor-pointer hover:bg-accent/50 flex flex-col items-center justify-center text-xs transition-colors"
                                        onClick={() => handleDayClick(date)}
                                    >
                                        <div className={`text-xs mb-1 ${
                                            statusIcon === '[✓]' ? 'text-green-600' :
                                            statusIcon === '[?]' ? 'text-yellow-600' :
                                            'text-gray-400'
                                        }`}>
                                            {statusIcon}
                                        </div>
                                        <div className="font-medium">{format(date, 'd')}</div>
                                        {impValue !== undefined && (
                                            <div className="text-xs text-muted-foreground">
                                                {formatImpressions(impValue)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ヒント */}
                    <div className="text-sm text-muted-foreground text-center">
                        💡 ヒント: セルをクリックして数値を入力してください
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}