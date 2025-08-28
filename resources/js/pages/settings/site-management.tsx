import { Head } from '@inertiajs/react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { type BreadcrumbItem } from '@/types';
import { AlertCircle, CheckCircle, Copy, Globe, Shield } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ドメイン管理',
        href: '/settings/site-management',
    },
];

export default function SiteManagement() {
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [domain, setDomain] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // プロトタイプ用のダミー処理
    const generateVerificationToken = () => {
        const token = 'ad-measure-verification=' + Math.random().toString(36).substring(2, 50);
        return token;
    };

    const requestVerification = async () => {
        if (!domain) return;
        
        setIsLoading(true);
        // 2秒待機してAPIコールをシミュレート
        setTimeout(() => {
            const token = generateVerificationToken();
            setVerificationToken(token);
            setCurrentStep(2);
            setIsLoading(false);
        }, 2000);
    };

    const checkVerification = async () => {
        setIsLoading(true);
        // 3秒待機してDNS確認をシミュレート
        setTimeout(() => {
            setCurrentStep(3);
            setIsLoading(false);
        }, 3000);
    };

    const copyToken = () => {
        navigator.clipboard.writeText(verificationToken);
        alert('値をコピーしました');
    };

    const [trackingTag, setTrackingTag] = useState('');
    const [showTrackingTag, setShowTrackingTag] = useState(false);

    const generateTrackingTag = () => {
        const tag = `<script type="text/javascript">
var _paq = window._paq = window._paq || [];

// URLパラメータからキャンペーンIDを取得
function getCampaignId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('campaign_id') || urlParams.get('cid');
}

// キャンペーンIDをカスタムディメンションにセット
const campaignId = getCampaignId();
if (campaignId) {
    _paq.push(['setCustomDimension', 1, campaignId]); // ディメンション1にキャンペーンID
}

_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
_paq.push(['setTrackerUrl', 'https://track-iip.your-saas.com/matomo.php']);
_paq.push(['setSiteId', '1']);

(function() {
    var u = 'https://track-iip.your-saas.com/';
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
})();
</script>`;
        
        setTrackingTag(tag);
        setShowTrackingTag(true);
    };

    const copyTrackingTag = () => {
        navigator.clipboard.writeText(trackingTag);
        alert('トラッキングタグをコピーしました');
    };

    const resetProcess = () => {
        setCurrentStep(1);
        setDomain('');
        setVerificationToken('');
        setTrackingTag('');
        setShowTrackingTag(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ドメイン管理" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="ドメイン管理" description="ドメイン検証を行い、トラッキングタグを設置するサイトを管理します" />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                ドメイン追加
                            </CardTitle>
                            <CardDescription>
                                タグ設置したサイトが正しいサイトであるか、ドメイン検証を行います
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            {/* Step 1: ドメイン入力 */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="domain">ドメイン名</Label>
                                        <Input
                                            id="domain"
                                            type="text"
                                            placeholder="example.com"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            className="max-w-md"
                                        />
                                    </div>
                                    <Button 
                                        onClick={requestVerification} 
                                        disabled={!domain || isLoading}
                                        className="flex items-center gap-2"
                                    >
                                        <Shield className="h-4 w-4" />
                                        {isLoading ? '処理中...' : '認証を開始'}
                                    </Button>
                                </div>
                            )}

                            {/* Step 2: TXTレコード設定指示 */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle className="flex items-center gap-2">
                                            DNS設定が必要です
                                        </AlertTitle>
                                        <AlertDescription>
                                            以下のTXTレコードをDNS設定に追加してください：
                                        </AlertDescription>
                                    </Alert>

                                    <div className="bg-muted p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <strong>レコードタイプ:</strong>
                                                <div className="font-mono bg-background px-2 py-1 rounded mt-1">TXT</div>
                                            </div>
                                            <div>
                                                <strong>名前:</strong>
                                                <div className="font-mono bg-background px-2 py-1 rounded mt-1">@ (またはルートドメイン)</div>
                                            </div>
                                            <div className="col-span-2">
                                                <strong>値:</strong>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="font-mono bg-background px-2 py-1 rounded flex-1 text-xs break-all">
                                                        {verificationToken}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={copyToken}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                        コピー
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        <strong>主要DNS事業者での設定方法:</strong>
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>CloudFlare: DNS → レコードを追加</li>
                                            <li>お名前.com: DNS設定 → TXTレコード</li>
                                            <li>Route53: ホストゾーン → レコード作成</li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={checkVerification}
                                            disabled={isLoading}
                                            className="flex items-center gap-2"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            {isLoading ? 'DNS確認中...' : '認証を確認'}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={resetProcess}
                                        >
                                            やり直し
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: 認証完了 */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertTitle className="text-green-800">認証完了</AlertTitle>
                                        <AlertDescription className="text-green-700">
                                            ドメイン認証が完了しました。トラッキングタグを生成できます。
                                        </AlertDescription>
                                    </Alert>

                                    <Button 
                                        onClick={generateTrackingTag}
                                        className="flex items-center gap-2"
                                    >
                                        <Globe className="h-4 w-4" />
                                        トラッキングタグを生成
                                    </Button>
                                </div>
                            )}

                            {currentStep > 1 && (
                                <>
                                    <Separator />
                                    <div className="text-sm text-muted-foreground">
                                        <strong>対象ドメイン:</strong> {domain}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* トラッキングタグ表示エリア */}
                    {showTrackingTag && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    生成されたトラッキングタグ
                                </CardTitle>
                                <CardDescription>
                                    以下のタグをウェブサイトの&lt;head&gt;セクションに追加してください
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <pre className="flex-1 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                                            {trackingTag}
                                        </pre>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copyTrackingTag}
                                            className="flex items-center gap-1 shrink-0"
                                        >
                                            <Copy className="h-3 w-3" />
                                            コピー
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <strong>設置方法:</strong>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>HTMLファイルの&lt;head&gt;タグ内にコードを貼り付け</li>
                                        <li>WordPressの場合: テーマの functions.php またはプラグイン使用</li>
                                        <li>キャンペーンIDは ?campaign_id=xxx または ?cid=xxx で自動取得</li>
                                    </ul>
                                </div>
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>重要</AlertTitle>
                                    <AlertDescription>
                                        このタグは {domain} ドメインでのみ動作します。他のドメインで使用する場合は、そのドメインでも認証を行ってください。
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}