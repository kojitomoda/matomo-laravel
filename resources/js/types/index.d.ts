import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ChartDataPoint {
    date: string;
    label: string;
    clicks: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgTimeOnSite: string;
}

export interface ClickAnalytics {
    period: number;
    totalClicks: number;
    trackingLinkId: string | null;
    chartData: ChartDataPoint[];
    summary: {
        avgClicks: number;
        maxClicks: number;
        minClicks: number;
        avgBounceRate: number;
        trend: 'up' | 'down' | 'stable';
        trendPercentage: number;
    };
}

export interface PeriodOption {
    value: number;
    label: string;
}

export interface DeviceDataPoint {
    name: string;
    value: number;
    percentage: number;
    fill: string;
}

export interface DeviceAnalytics {
    period: number;
    total: number;
    data: DeviceDataPoint[];
}

export interface BrowserDataPoint {
    name: string;
    value: number;
    percentage: number;
    fill: string;
}

export interface BrowserAnalytics {
    period: number;
    total: number;
    data: BrowserDataPoint[];
}

export interface CpcAnalytics {
    period: number;
    ad_spend: number;
    total_clicks: number;
    cpc: number;
    cpc_formatted: string;
    previous_cpc: number;
    cpc_change: number;
    cpc_change_percent: number;
    cpc_trend: 'up' | 'down' | 'stable';
    budget_utilization: {
        budget: number;
        spent: number;
        remaining: number;
        percentage: number;
    };
    average_position: number;
    quality_score: number;
}

export interface ConversionByType {
    count: number;
    cvr: number;
    url: string;
    label: string;
}

export interface CvrAnalytics {
    total_cvr: number;
    total_cvr_formatted: string;
    total_conversions: number;
    total_clicks: number;
    cvr_trend: 'up' | 'down' | 'stable';
    cvr_change_percent: number;
    conversions_by_type: {
        purchase: ConversionByType;
        inquiry: ConversionByType;
    };
    period: number;
}

export interface CttDataPoint {
    time_range: string;
    hour_start: number;
    clicks: number;
    percentage: number;
}

export interface CttAnalytics {
    period: number;
    total_clicks: number;
    peak_hour: string;
    data: CttDataPoint[];
}

export interface CvtDataPoint {
    time_range: string;
    hour_start: number;
    conversions: number;
    percentage: number;
}

export interface CvtAnalytics {
    period: number;
    total_conversions: number;
    data: CvtDataPoint[];
}

export interface CpaConversionByType {
    count: number;
    cpa: number;
    cpa_formatted: string;
    ad_spend: number;
    url: string;
    label: string;
}

export interface CpaAnalytics {
    total_cpa: number;
    total_cpa_formatted: string;
    total_conversions: number;
    ad_spend: number;
    cpa_trend: 'up' | 'down' | 'stable';
    cpa_change_percent: number;
    conversions_by_type: {
        purchase: CpaConversionByType;
        inquiry: CpaConversionByType;
    };
    period: number;
}
