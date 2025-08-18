// demoTracker.js - 広告計測SaaS用トラッキングスクリプト（デモ版）
(function() {
'use strict';

// グローバル変数の初期化
window._paq = window._paq || [];

// デモ用設定
const CONFIG = {
    matomoUrl: 'http://localhost:8080/', // Matomoサーバー
    apiUrl: 'mock', // モックAPIを使用
    cookieMaxAge: 63072000, // 2年
    cookiePath: '/',
    debug: true // デモ版は常にデバッグモードON
};

// ユーティリティ関数
const utils = {
    // Cookie取得
    getCookie: function(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    },

    // Cookie設定
    setCookie: function(name, value, maxAge) {
        const domain = window.location.hostname.replace(/^www\./, '');
        document.cookie = `${name}=${value}; max-age=${maxAge}; path=${CONFIG.cookiePath}; domain=.${domain}`;
    },

    // デバッグログ（デモ版は常に表示）
    log: function(...args) {
        console.log('[DemoTracker]', ...args);
    }
};

// トラッキング情報の保存
function saveTrackingInfo(data) {
    utils.setCookie('mtm_tracking', data.tracking_value, CONFIG.cookieMaxAge);
    utils.setCookie('mtm_site', data.site_id, CONFIG.cookieMaxAge);
    utils.setCookie('mtm_cd_id', data.tracking_dimension_id, CONFIG.cookieMaxAge);
    utils.log('✅ Tracking info saved:', data);
}

// トラッキング情報の読み込み
function loadTrackingInfo() {
    return {
        trackingId: utils.getCookie('mtm_tracking'),
        siteId: utils.getCookie('mtm_site'),
        dimensionId: utils.getCookie('mtm_cd_id')
    };
}

// Matomoへデータ送信
function sendToMatomo(trackingData) {
    if (!window._paq) {
        utils.log('❌ Error: Matomo not loaded');
        return;
    }

    const siteId = trackingData.site_id || trackingData.siteId;
    _paq.push(['setSiteId', siteId]);
    utils.log(`📊 Site ID set: ${siteId}`);

    const dimensionId = trackingData.tracking_dimension_id || trackingData.dimensionId;
    const trackingValue = trackingData.tracking_value || trackingData.trackingId;

    if (dimensionId && trackingValue) {
        _paq.push(['setCustomDimension', parseInt(dimensionId), trackingValue]);
        utils.log(`🎯 Custom dimension set: ID=${dimensionId}, Value=${trackingValue}`);
    }

    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    utils.log('📈 Page view tracked to Matomo server');
}

// モック版の署名検証（常に成功）
function mockVerifyAndTrack(params) {
    const payload = {
        sid: params.get('site'),
        trk: params.get('trk'),
        sig: params.get('sig')
    };

    utils.log('🔍 Mock verification (always success):', payload);

    // モックレスポンス（常に成功）
    const mockResponse = {
        valid: true,
        site_id: payload.sid || '1',
        tracking_value: payload.trk || 'demo_tracking_' + Date.now(),
        tracking_dimension_id: '1' // カスタムディメンションID 1を固定使用
    };

    setTimeout(function() {
        utils.log('✅ Mock verification successful');
        saveTrackingInfo(mockResponse);
        sendToMatomo(mockResponse);
    }, 100); // 100msの遅延でAPIコールをシミュレート
}

// メイン初期化関数
function initializeTracking() {
    utils.log('🚀 Initializing demo tracking...');

    const params = new URLSearchParams(window.location.search);
    const sig = params.get('sig');

    // 広告経由の初回アクセス（署名あり）
    if (sig && params.get('trk') && params.get('site')) {
        utils.log('🎉 New ad click detected');
        mockVerifyAndTrack(params);
    }
    // 既存のトラッキング情報がある場合
    else {
        const savedInfo = loadTrackingInfo();
        
        if (savedInfo.trackingId && savedInfo.dimensionId) {
            utils.log('🔄 Existing tracking found:', savedInfo);
            sendToMatomo(savedInfo);
        } else {
            utils.log('ℹ️ No tracking info found - organic traffic ignored');
        }
    }
}

// Matomo本体のスクリプトを読み込み
function loadMatomoScript(callback) {
    utils.log('📥 Loading Matomo.js from:', CONFIG.matomoUrl);

    // Matomo設定
    _paq.push(['disableCookies']); // Matomoのデフォルトcookieは使わない
    _paq.push(['setTrackerUrl', CONFIG.matomoUrl + 'matomo.php']);
    _paq.push(['enableLinkTracking']);

    // スクリプトタグの作成と挿入
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];

    g.type = 'text/javascript';
    g.async = true;
    g.src = CONFIG.matomoUrl + 'matomo.js';

    // 読み込み完了時のコールバック
    g.onload = function() {
        utils.log('✅ Matomo.js loaded successfully');
        if (callback) callback();
    };

    g.onerror = function() {
        utils.log('❌ Failed to load Matomo.js - Please check if Matomo is running on', CONFIG.matomoUrl);
    };

    s.parentNode.insertBefore(g, s);
}

// SPAサポート（オプション）
function setupSPATracking() {
    utils.log('🔄 Setting up SPA tracking support');

    // pushStateの監視
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        
        setTimeout(function() {
            const savedInfo = loadTrackingInfo();
            if (savedInfo.trackingId) {
                _paq.push(['setCustomUrl', window.location.href]);
                sendToMatomo(savedInfo);
                utils.log('📍 SPA navigation tracked:', window.location.href);
            }
        }, 0);
    };

    // popstateイベント
    window.addEventListener('popstate', function() {
        const savedInfo = loadTrackingInfo();
        if (savedInfo.trackingId) {
            _paq.push(['setCustomUrl', window.location.href]);
            sendToMatomo(savedInfo);
            utils.log('🔙 Browser back/forward tracked');
        }
    });
}

// イベントトラッキング用のグローバル関数を提供
window.trackEvent = function(category, action, name, value) {
    const savedInfo = loadTrackingInfo();
    
    if (savedInfo.trackingId && savedInfo.dimensionId) {
        _paq.push(['setCustomDimension', parseInt(savedInfo.dimensionId), savedInfo.trackingId]);
    }
    
    _paq.push(['trackEvent', category, action, name, value]);
    utils.log('🎯 Event tracked:', { category, action, name, value });
};

// デモ用ヘルパー関数
window.demoTracker = {
    // 現在のトラッキング情報を表示
    showInfo: function() {
        const info = loadTrackingInfo();
        console.table({
            'Tracking ID': info.trackingId || 'Not set',
            'Site ID': info.siteId || 'Not set',
            'Dimension ID': info.dimensionId || 'Not set',
            'Matomo URL': CONFIG.matomoUrl
        });
    },
    
    // Cookieをクリア
    clearTracking: function() {
        utils.setCookie('mtm_tracking', '', -1);
        utils.setCookie('mtm_site', '', -1);
        utils.setCookie('mtm_cd_id', '', -1);
        utils.log('🗑️ Tracking cookies cleared');
    }
};

// 実行開始
utils.log('====================================');
utils.log('🚀 Demo Tracker Initializing...');
utils.log('📍 Current URL:', window.location.href);
utils.log('🌐 Matomo Server:', CONFIG.matomoUrl);
utils.log('====================================');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadMatomoScript(function() {
            initializeTracking();
            setupSPATracking();
            utils.log('✅ Demo Tracker Ready!');
            utils.log('💡 Tip: Use window.demoTracker.showInfo() to check tracking status');
        });
    });
} else {
    loadMatomoScript(function() {
        initializeTracking();
        setupSPATracking();
        utils.log('✅ Demo Tracker Ready!');
        utils.log('💡 Tip: Use window.demoTracker.showInfo() to check tracking status');
    });
}

})();