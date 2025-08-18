import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface NewCvModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewCvModal({ open, onOpenChange }: NewCvModalProps) {
    const [formData, setFormData] = useState({
        pageName: '',
        goalUrl: '',
        cvValue: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // プロトタイプなので実際の処理は行わない
        console.log('新規CV設定作成:', formData);
        onOpenChange(false);
        // フォームをリセット
        setFormData({
            pageName: '',
            goalUrl: '',
            cvValue: ''
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        // フォームをリセット
        setFormData({
            pageName: '',
            goalUrl: '',
            cvValue: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>新規CV設定</DialogTitle>
                    <DialogDescription>
                        新しいコンバージョン設定を作成します。<br/>入力された情報を元にコンバージョントラッキングが設定されます。
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pageName">ページ名</Label>
                        <Input
                            id="pageName"
                            type="text"
                            placeholder="例: 商品購入完了ページ"
                            value={formData.pageName}
                            onChange={(e) => setFormData(prev => ({ ...prev, pageName: e.target.value }))}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="goalUrl">ゴールURL</Label>
                        <Input
                            id="goalUrl"
                            type="text"
                            placeholder="例: /thanks"
                            value={formData.goalUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, goalUrl: e.target.value }))}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="cvValue">CV価値（円）</Label>
                        <div className="relative">
                            <Input
                                id="cvValue"
                                type="number"
                                placeholder="5000"
                                value={formData.cvValue}
                                onChange={(e) => setFormData(prev => ({ ...prev, cvValue: e.target.value }))}
                                required
                                className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                円
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            1つのコンバージョンの金銭的価値を入力してください
                        </p>
                    </div>
                </form>
                
                <DialogFooter className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        キャンセル
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                    >
                        作成
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}