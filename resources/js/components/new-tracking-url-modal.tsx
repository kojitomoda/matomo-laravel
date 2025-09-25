import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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
    const [isLoading, setIsLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // 5秒後にURLを表示
        setTimeout(() => {
            setGeneratedUrl('https://iip-inc.com/lp?campId=zNg1cZfApEYQgVEWnoHL339bvbpe9JSIAKrxSLK9jY13wfaE16');
            setIsLoading(false);
        }, 5000);
    };

    const handleCancel = () => {
        onOpenChange(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            displayName: '',
            adUrl: '',
            adBudget: ''
        });
        setIsLoading(false);
        setGeneratedUrl('');
        setIsCopied(false);
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(generatedUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('URLのコピーに失敗しました:', err);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>新規キャンペーン追加</DialogTitle>
                    <DialogDescription>
                        新しいキャンペーンを追加します。<br/>入力された情報を元にキャンペーン用のURLが生成されます。
                    </DialogDescription>
                </DialogHeader>

                {!isLoading && !generatedUrl && (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">キャンペーン名</Label>
                                <Input
                                    id="displayName"
                                    type="text"
                                    placeholder="例: 検索キャンペーン_キーワード1"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="adUrl">キャンペーンURL（ドメイン以下）</Label>
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
                                <Label htmlFor="adBudget">キャンペーン費用（月額）</Label>
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
                                発行
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <p className="text-sm text-muted-foreground">登録中...</p>
                    </div>
                )}

                {generatedUrl && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>生成されたキャンペーンURL</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={generatedUrl}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyUrl}
                                    className="flex items-center space-x-1"
                                >
                                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    <span>{isCopied ? 'コピー済み' : 'コピー'}</span>
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleClose}>
                                完了
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
