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
import { NewTrackingUrlModal } from './new-tracking-url-modal';
import { NewCvModal } from './new-cv-modal';

const mainNavItems: NavItem[] = [];

// 測定URL一覧（プロトタイプ用）
const trackingUrls = [
    { id: '1', displayName: 'Google検索広告_キーワード1' },
    { id: '2', displayName: 'Meta広告_見込み顧客獲得' },
    { id: '3', displayName: 'Yahoo!検索広告_ブランド名' },
    { id: '4', displayName: 'Instagram広告_商品紹介' },
    { id: '5', displayName: 'YouTube広告_動画宣伝' },
    { id: '6', displayName: 'X(Twitter)広告_認知拡大' },
    { id: '7', displayName: 'LinkedIn広告_BtoB営業' },
    { id: '8', displayName: 'TikTok広告_若年層向け' },
    { id: '9', displayName: 'アフィリエイト_ASP経由' },
    { id: '10', displayName: 'メール配信_既存顧客向け' },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCvModalOpen, setIsCvModalOpen] = useState(false);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                
                {/* 新規測定URLボタン */}
                <div className="px-2 mt-4">
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full justify-start text-orange-500 hover:text-orange-600 bg-sidebar hover:bg-sidebar/80 border-none text-base"
                        variant="outline"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        新規測定URL
                    </Button>
                </div>

                {/* 測定URL一覧 */}
                <div className="px-2 mt-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="text-sm font-medium opacity-70">
                                <BarChart3 className="mr-2 h-4 w-4" />
                                測定URL一覧
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
