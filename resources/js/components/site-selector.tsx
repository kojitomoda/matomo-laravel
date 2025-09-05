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

export function SiteSelector() {
    const [selectedSite, setSelectedSite] = useState('1'); // デフォルトはCov

    return (
        <div className="flex items-center gap-3 px-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Globe className="size-5 text-white dark:text-black" />
            </div>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="flex-1 border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 text-base font-semibold">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {mockSites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                            {site.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}