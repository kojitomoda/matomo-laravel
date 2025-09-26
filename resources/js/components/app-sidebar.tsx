import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Plus, BarChart3, Target } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';
import { SiteSelector } from './site-selector';
import { NewTrackingUrlModal } from './new-tracking-url-modal';
import { NewCvModal } from './new-cv-modal';

const mainNavItems: NavItem[] = [];

// サイト別キャンペーンURL一覧（プロトタイプ用）
const trackingUrlsBySite: Record<string, Array<{ id: string; displayName: string }>> = {
    '1': [ // Cov
        { id: '1', displayName: 'Google検索広告_キーワード1' },
        { id: '2', displayName: 'Meta広告_見込み顧客獲得' },
        { id: '3', displayName: 'Yahoo!検索広告_ブランド名' },
        { id: '4', displayName: 'Instagram広告_商品紹介' },
        { id: '5', displayName: 'YouTube広告_動画宣伝' },
    ],
    '2': [ // 9ZLabo
        { id: '6', displayName: 'X(Twitter)広告_認知拡大' },
        { id: '7', displayName: 'LinkedIn広告_BtoB営業' },
        { id: '8', displayName: 'TikTok広告_若年層向け' },
        { id: '9', displayName: 'アフィリエイト_ASP経由' },
        { id: '10', displayName: 'メール配信_既存顧客向け' },
        { id: '11', displayName: 'リスティング広告_ブランド' },
        { id: '12', displayName: 'ディスプレイ広告_リターゲティング' },
    ],
    '3': [ // Studioレジスタ
        { id: '13', displayName: 'Google広告_地域限定' },
        { id: '14', displayName: 'Facebook広告_イベント集客' },
        { id: '15', displayName: 'Instagram広告_サービス紹介' },
        { id: '16', displayName: 'YouTube広告_実績動画' },
    ],
    '4': [ // Nobilista
        { id: '17', displayName: 'SEOツール_リスティング' },
        { id: '18', displayName: 'コンテンツマーケティング_記事' },
        { id: '19', displayName: 'メルマガ_機能紹介' },
        { id: '20', displayName: 'ウェビナー_集客広告' },
        { id: '21', displayName: 'アフィリエイト_パートナー' },
    ],
};

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCvModalOpen, setIsCvModalOpen] = useState(false);
    
    // URLパラメータから現在選択されているプロジェクトを取得
    const getInitialProject = () => {
        if (typeof window === 'undefined') return '1';
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('project') || '1';
    };
    
    const [selectedSite, setSelectedSite] = useState(getInitialProject());

    // 選択されたサイトのキャンペーンURL一覧を取得
    const trackingUrls = trackingUrlsBySite[selectedSite] || [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-transparent">
                            <SiteSelector onSiteChange={setSelectedSite} initialValue={selectedSite} />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                {/* キャンペーン一覧ボタン */}
                <div className="px-2 mt-4">
                    <Button 
                        asChild
                        className="w-full justify-start text-blue-600 hover:text-blue-800 bg-sidebar hover:bg-sidebar/80 border-none text-base"
                        variant="outline"
                    >
                        <Link href="/dashboard">
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            キャンペーン一覧
                        </Link>
                    </Button>
                </div>
                
                {/* キャンペーン名 */}
                <div className="px-2 mt-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="text-sm font-medium opacity-70">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                キャンペーン名
                            </SidebarMenuButton>
                            <SidebarMenuSub className="space-y-1">
                                {trackingUrls.map((url) => (
                                    <SidebarMenuSubItem key={url.id}>
                                        <SidebarMenuSubButton 
                                            asChild
                                            className="hover:bg-accent hover:text-accent-foreground cursor-pointer py-2 text-sm"
                                        >
                                            <Link 
                                                href={`/dashboard?tracking_url=${url.id}&name=${encodeURIComponent(url.displayName)}`}
                                                className="block w-full truncate"
                                                title={url.displayName}
                                            >
                                                {url.displayName}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                
                {/* 新規キャンペーン追加ボタン */}
                <div className="px-2 mb-2">
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full justify-start text-orange-500 hover:text-orange-600 bg-sidebar hover:bg-sidebar/80 border-none text-base"
                        variant="outline"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        新規キャンペーン追加
                    </Button>
                </div>
                
                {/* 新規CV設定ボタン */}
                <div className="px-2 mb-2">
                    <Button 
                        onClick={() => setIsCvModalOpen(true)}
                        className="w-full justify-start text-orange-500 hover:text-orange-600 bg-sidebar hover:bg-sidebar/80 border-none text-base"
                        variant="outline"
                    >
                        <Target className="mr-2 h-4 w-4" />
                        新規CV設定
                    </Button>
                </div>
                
                <NavUser />
            </SidebarFooter>

            <NewTrackingUrlModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
            />
            <NewCvModal 
                open={isCvModalOpen} 
                onOpenChange={setIsCvModalOpen} 
            />
        </Sidebar>
    );
}
