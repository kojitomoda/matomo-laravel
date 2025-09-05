import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

// ダミーデータ
const mockSites = [
    {
        id: 1,
        name: 'Cov',
        url: 'https://cov.jp/',
        trackingUrlCount: 8,
    },
    {
        id: 2,
        name: '9ZLabo',
        url: 'https://9zlabo.com/',
        trackingUrlCount: 12,
    },
    {
        id: 3,
        name: 'Studioレジスタ',
        url: 'https://regista-osaka.com/',
        trackingUrlCount: 9,
    },
    {
        id: 4,
        name: 'Nobilista',
        url: 'https://co.nobilista.com/ja/',
        trackingUrlCount: 7,
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'サイト一覧',
        href: '/settings/site-list',
    },
];

export default function SiteList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="サイト一覧" />
            <SettingsLayout>
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">サイト一覧</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        管理中のサイトと測定URL発行状況を確認できます
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 rounded-l-lg whitespace-nowrap">
                                            サイト名
                                        </th>
                                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                                            URL
                                        </th>
                                        <th scope="col" className="px-6 py-3 rounded-r-lg text-center whitespace-nowrap">
                                            測定URL発行数
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockSites.map((site) => (
                                        <tr key={site.id} className="border-b">
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                {site.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    href={site.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                                                >
                                                    {site.url}
                                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {site.trackingUrlCount}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold">
                                        <td colSpan={2} className="px-6 py-3 text-right">
                                            合計
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {mockSites.reduce((sum, site) => sum + site.trackingUrlCount, 0)}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </SettingsLayout>
        </AppLayout>
    );
}