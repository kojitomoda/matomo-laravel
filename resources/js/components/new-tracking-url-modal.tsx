import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface NewTrackingUrlModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewTrackingUrlModal({ open, onOpenChange }: NewTrackingUrlModalProps) {
    const [formData, setFormData] = useState({
        displayName: '',
        adUrl: '',
        adBudget: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // プロトタイプなので実際の処理は行わない
        console.log('新規測定URL作成:', formData);
        onOpenChange(false);
        // フォームをリセット
        setFormData({
            displayName: '',
            adUrl: '',
            adBudget: ''
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
        // フォームをリセット
        setFormData({
            displayName: '',
            adUrl: '',
            adBudget: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>新規測定URL作成</DialogTitle>
                    <DialogDescription>
                        新しい測定URLを作成します。<br/>si入力された情報を元に測定用のURLが生成されます。
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">広告名</Label>
                        <Input
                            id="displayName"
                            type="text"
                            placeholder="例: 検索広告_キーワード1"
                            value={formData.displayName}
                            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adUrl">広告URL（ドメイン以下）</Label>
                        <Input
                            id="adUrl"
                            type="text"
                            placeholder="例: /landing-page"
                            value={formData.adUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, adUrl: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adBudget">広告費用（月額）</Label>
                        <div className="relative">
                            <Input
                                id="adBudget"
                                type="number"
                                placeholder="100000"
                                value={formData.adBudget}
                                onChange={(e) => setFormData(prev => ({ ...prev, adBudget: e.target.value }))}
                                required
                                className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                                円
                            </span>
                        </div>
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
