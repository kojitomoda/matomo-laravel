import{j as e,r,H as z}from"./app-COrx9vEF.js";import{H as B}from"./heading-small-7AtmpjbY.js";import{a as d,c as p,f as H,B as i}from"./createLucideIcon-nOXXPSeH.js";import{C as y,a as k,b as T,d as w,c as C}from"./card-O-UPf1ib.js";import{L as E,I as R}from"./label-y54AWM8v.js";import{S as F,a as U}from"./layout-f9vBEtuQ.js";import{s as X,y as b}from"./app-layout-DONDFLUY.js";/* empty css            *//**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],S=d("CircleAlert",$);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],_=d("CircleCheckBig",G);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],o=d("Globe",W);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],K=d("Shield",J),O=H("relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",{variants:{variant:{default:"bg-background text-foreground",destructive:"text-destructive-foreground [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/80"}},defaultVariants:{variant:"default"}});function m({className:s,variant:a,...t}){return e.jsx("div",{"data-slot":"alert",role:"alert",className:p(O({variant:a}),s),...t})}function x({className:s,...a}){return e.jsx("div",{"data-slot":"alert-title",className:p("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",s),...a})}function g({className:s,...a}){return e.jsx("div",{"data-slot":"alert-description",className:p("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",s),...a})}const Q=[{title:"新規プロジェクト追加",href:"/settings/site-management"}];function ce(){const[s,a]=r.useState(1),[t,h]=r.useState(""),[u,j]=r.useState(""),[n,l]=r.useState(!1),D=()=>"ad-measure-verification="+Math.random().toString(36).substring(2,50),I=async()=>{t&&(l(!0),setTimeout(()=>{const c=D();j(c),a(2),l(!1)},2e3))},L=async()=>{l(!0),setTimeout(()=>{a(3),l(!1)},3e3)},q=()=>{navigator.clipboard.writeText(u),alert("値をコピーしました")},[f,N]=r.useState(""),[V,v]=r.useState(!1),A=()=>{N(`<script type="text/javascript">
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
<\/script>`),v(!0)},M=()=>{navigator.clipboard.writeText(f),alert("トラッキングタグをコピーしました")},P=()=>{a(1),h(""),j(""),N(""),v(!1)};return e.jsxs(X,{breadcrumbs:Q,children:[e.jsx(z,{title:"新規プロジェクト追加"}),e.jsx(F,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(B,{title:"新規プロジェクト追加",description:"新しいプロジェクトのドメイン検証を行い、トラッキングタグを設置します"}),e.jsxs(y,{children:[e.jsxs(k,{children:[e.jsxs(T,{className:"flex items-center gap-2",children:[e.jsx(o,{className:"h-5 w-5"}),"プロジェクト追加"]}),e.jsx(w,{children:"新規プロジェクトのドメインを追加し、トラッキング設定を行います"})]}),e.jsxs(C,{className:"space-y-6",children:[s===1&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(E,{htmlFor:"domain",children:"ドメイン名"}),e.jsx(R,{id:"domain",type:"text",placeholder:"example.com",value:t,onChange:c=>h(c.target.value),className:"max-w-md"})]}),e.jsxs(i,{onClick:I,disabled:!t||n,className:"flex items-center gap-2",children:[e.jsx(K,{className:"h-4 w-4"}),n?"処理中...":"認証を開始"]})]}),s===2&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs(m,{children:[e.jsx(S,{className:"h-4 w-4"}),e.jsx(x,{className:"flex items-center gap-2",children:"DNS設定が必要です"}),e.jsx(g,{children:"以下のTXTレコードをDNS設定に追加してください："})]}),e.jsx("div",{className:"bg-muted p-4 rounded-lg",children:e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"レコードタイプ:"}),e.jsx("div",{className:"font-mono bg-background px-2 py-1 rounded mt-1",children:"TXT"})]}),e.jsxs("div",{children:[e.jsx("strong",{children:"名前:"}),e.jsx("div",{className:"font-mono bg-background px-2 py-1 rounded mt-1",children:"@ (またはルートドメイン)"})]}),e.jsxs("div",{className:"col-span-2",children:[e.jsx("strong",{children:"値:"}),e.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[e.jsx("div",{className:"font-mono bg-background px-2 py-1 rounded flex-1 text-xs break-all",children:u}),e.jsxs(i,{variant:"outline",size:"sm",onClick:q,className:"flex items-center gap-1",children:[e.jsx(b,{className:"h-3 w-3"}),"コピー"]})]})]})]})}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.jsx("strong",{children:"主要DNS事業者での設定方法:"}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsx("li",{children:"CloudFlare: DNS → レコードを追加"}),e.jsx("li",{children:"お名前.com: DNS設定 → TXTレコード"}),e.jsx("li",{children:"Route53: ホストゾーン → レコード作成"})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(i,{onClick:L,disabled:n,className:"flex items-center gap-2",children:[e.jsx(_,{className:"h-4 w-4"}),n?"DNS確認中...":"認証を確認"]}),e.jsx(i,{variant:"outline",onClick:P,children:"やり直し"})]})]}),s===3&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs(m,{className:"border-green-200 bg-green-50",children:[e.jsx(_,{className:"h-4 w-4 text-green-600"}),e.jsx(x,{className:"text-green-800",children:"認証完了"}),e.jsx(g,{className:"text-green-700",children:"ドメイン認証が完了しました。トラッキングタグを生成できます。"})]}),e.jsxs(i,{onClick:A,className:"flex items-center gap-2",children:[e.jsx(o,{className:"h-4 w-4"}),"トラッキングタグを生成"]})]}),s>1&&e.jsxs(e.Fragment,{children:[e.jsx(U,{}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.jsx("strong",{children:"対象ドメイン:"})," ",t]})]})]})]}),V&&e.jsxs(y,{children:[e.jsxs(k,{children:[e.jsxs(T,{className:"flex items-center gap-2",children:[e.jsx(o,{className:"h-5 w-5"}),"生成されたトラッキングタグ"]}),e.jsx(w,{children:"以下のタグをウェブサイトの<head>セクションに追加してください"})]}),e.jsxs(C,{className:"space-y-4",children:[e.jsx("div",{className:"bg-muted p-4 rounded-lg",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx("pre",{className:"flex-1 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words",children:f}),e.jsxs(i,{variant:"outline",size:"sm",onClick:M,className:"flex items-center gap-1 shrink-0",children:[e.jsx(b,{className:"h-3 w-3"}),"コピー"]})]})}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.jsx("strong",{children:"設置方法:"}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsx("li",{children:"HTMLファイルの<head>タグ内にコードを貼り付け"}),e.jsx("li",{children:"WordPressの場合: テーマの functions.php またはプラグイン使用"}),e.jsx("li",{children:"キャンペーンIDは ?campaign_id=xxx または ?cid=xxx で自動取得"})]})]}),e.jsxs(m,{children:[e.jsx(S,{className:"h-4 w-4"}),e.jsx(x,{children:"重要"}),e.jsxs(g,{children:["このタグは ",t," ドメインでのみ動作します。他のドメインで使用する場合は、そのドメインでも認証を行ってください。"]})]})]})]})]})})]})}export{ce as default};
