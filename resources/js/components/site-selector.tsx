import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useState } from 'react';

// ダミーデータ（サイト一覧と同じ）
const mockSites = [
    { id: '1', name: 'Cov', url: 'https://cov.jp/' },
    { id: '2', name: '9ZLabo', url: 'https://9zlabo.com/' },
    { id: '3', name: 'Studioレジスタ', url: 'https://regista-osaka.com/' },
    { id: '4', name: 'Nobilista', url: 'https://co.nobilista.com/ja/' },
];

interface SiteSelectorProps {
    onSiteChange?: (siteId: string) => void;
}

export function SiteSelector({ onSiteChange }: SiteSelectorProps) {
    // URLパラメータから現在選択されているプロジェクトを取得
    const getInitialProject = () => {
        if (typeof window === 'undefined') return '1';
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('project') || '1';
    };
    
    const [selectedSite, setSelectedSite] = useState(getInitialProject());

    const handleValueChange = (value: string) => {
        setSelectedSite(value);
        onSiteChange?.(value);
        
        // プロジェクト変更時は常にキャンペーン一覧ページに遷移
        if (typeof window !== 'undefined') {
            window.location.href = `/dashboard?project=${value}`;
        }
    };

    return (
        <div className="px-2">
            <div className="text-sm text-muted-foreground mt-1">プロジェクト名</div>
            <div className="flex items-center gap-3">
                {/*<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">*/}
                {/*    <Globe className="size-5 text-white dark:text-black" />*/}
                {/*</div>*/}
                <Select value={selectedSite} onValueChange={handleValueChange}>
                    <SelectTrigger className="flex-1 py-2 border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 text-xl font-semibold">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {mockSites.map((site) => (
                            <SelectItem key={site.id} value={site.id} className="text-base">
                                {site.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
