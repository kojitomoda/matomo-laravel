// tracker.js - 広告計測SaaS用トラッキングスクリプト
(function() {
'use strict';

// グローバル変数の初期化
window._paq = window._paq || [];

// 設定
const CONFIG = {
    matomoUrl: 'https://track.example.com/',
    apiUrl: 'https://track.example.com/api/verify',
    cookieMaxAge: 63072000, // 2年
    cookiePath: '/',
    debug: window._trackingConfig && window._trackingConfig.debug || false
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

    // デバッグログ
    log: function(...args) {
        if (CONFIG.debug) {
            console.log('[AdTracker]', ...args);
        }
    }
};

// トラッキング情報の保存
function saveTrackingInfo(data) {
    utils.setCookie('mtm_tracking', data.tracking_value, CONFIG.cookieMaxAge);
    utils.setCookie('mtm_site', data.site_id, CONFIG.cookieMaxAge);
    utils.setCookie('mtm_cd_id', data.tracking_dimension_id, CONFIG.cookieMaxAge);
    utils.log('Tracking info saved:', data);
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
        utils.log('Error: Matomo not loaded');
        return;
    }

    _paq.push(['setSiteId', trackingData.site_id || trackingData.siteId]);

    const dimensionId = trackingData.tracking_dimension_id || trackingData.dimensionId;
    const trackingValue = trackingData.tracking_value || trackingData.trackingId;

    if (dimensionId && trackingValue) {
        _paq.push(['setCustomDimension', parseInt(dimensionId), trackingValue]);
        utils.log('Custom dimension set:', dimensionId, trackingValue);
    }

    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    utils.log('Page view tracked');
}

// 署名検証とトラッキング開始
function verifyAndTrack(params) {
    const payload = {
        sid: params.get('site'),
        trk: params.get('trk'),
        sig: params.get('sig')
    };

    utils.log('Verifying signature:', payload);

    fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'omit'
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Verification failed: ' + response.status);
        }
        return response.json();
    })
    .then(function(result) {
        if (result.valid) {
            utils.log('Signature verified successfully');
            saveTrackingInfo(result);
            sendToMatomo(result);
        } else {
            utils.log('Invalid signature');
        }
    })
    .catch(function(error) {
        utils.log('Verification error:', error);
    });
}

// メイン初期化関数
function initializeTracking() {
    utils.log('Initializing tracking...');

    const params = new URLSearchParams(window.location.search);
    const sig = params.get('sig');

    // 広告経由の初回アクセス（署名あり）
    if (sig && params.get('trk') && params.get('site')) {
        utils.log('New ad click detected');
        verifyAndTrack(params);
    }
    // 既存のトラッキング情報がある場合
    else {
        const savedInfo = loadTrackingInfo();
        
        if (savedInfo.trackingId && savedInfo.dimensionId) {
            utils.log('Existing tracking found:', savedInfo);
            sendToMatomo(savedInfo);
        } else {
            utils.log('No tracking info found - organic traffic ignored');
        }
    }
}

// Matomo本体のスクリプトを読み込み
function loadMatomoScript(callback) {
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
        utils.log('Matomo.js loaded successfully');
        if (callback) callback();
    };

    g.onerror = function() {
        utils.log('Failed to load Matomo.js');
    };

    s.parentNode.insertBefore(g, s);
}

// SPAサポート（オプション）
function setupSPATracking() {
    // pushStateの監視
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(history, arguments);
        
        setTimeout(function() {
            const savedInfo = loadTrackingInfo();
            if (savedInfo.trackingId) {
                _paq.push(['setCustomUrl', window.location.href]);
                sendToMatomo(savedInfo);
            }
        }, 0);
    };

    // popstateイベント
    window.addEventListener('popstate', function() {
        const savedInfo = loadTrackingInfo();
        if (savedInfo.trackingId) {
            _paq.push(['setCustomUrl', window.location.href]);
            sendToMatomo(savedInfo);
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
    utils.log('Event tracked:', category, action);
};

// 実行開始
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        loadMatomoScript(function() {
            initializeTracking();
            setupSPATracking();
        });
    });
} else {
    loadMatomoScript(function() {
        initializeTracking();
        setupSPATracking();
    });
}

})();