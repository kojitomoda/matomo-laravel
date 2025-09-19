# サイドメニューのトップの「AD measure」のラベルを変更

登録したサイトをプルダウンで選択できるようにしたいです。ほげ
つまり、現在確認中のサイトが表示され、プルダウン選択で「Cov、9zlabo、Studioレジスタ、Nobilista」が表示されます。

現在は、ダミー表示なので、プルダウンを変更しても測定URL一覧を変更しなくて良いです。hogeho
発注者にイメージを掴んで貰えれば大丈夫です。デフォルトは、「Cov」を表示したいです。


# 仕様
matomoサーバーは、 http://localhost:8080
verifyAndTrackのapi/verifyはモック版を作成し、常に成功を返すようにする

Next.jsで作成したサンプルLP画面にscriptを設置します。
その際にアクセスURL http://localh/ost:3000 に続くパラメータを教えてください。
サンプルです。正常にデータがmatomoサーバーに保存されているか検証するだけです。



# 📘 技術仕様レポート：広告計測SaaS「測定URL生成サービス」

---

## 1. 🎯 プロジェクト概要

本プロジェクトは、クライアントごとに測定用の広告URLを生成し、クリック・CV（成果）などをトラッキングして可視化する**広告分析SaaS**です。  
**Matomo**をトラッキングエンジンとして利用しつつ、**データの主導権と可視化制御は当社サーバーで保持**します。

---

## 2. 🔐 セキュリティ方針

- 全広告リンクは **署名付きURL（JWT形式）** として発行
- LPにリダイレクト後、`tag.js` はパラメータ付きで当社 `/api/verify` に送信し、検証成功時のみ Matomo へ中継
- パラメータ改ざん防止のため、`sig`（HMACまたはJWT署名）を使用

---

## 3. 🏗️ システム構成（全体フロー）

```
① クライアント管理画面で広告リンク発行  
② サーバーで署名付きトークン（JWT）生成  
③ ユーザーが広告をクリック  
④ /click APIでトークンを検証し、LPにリダイレクト（trk, site, sig付き）  
⑤ LPに埋め込んだtag.jsが /api/verify に送信  
⑥ サーバーが署名検証し、OKであればMatomoへ転送  
⑦ クライアント管理画面がMatomo API経由で可視化
```

---

## 4. 🧩 データ識別要素と仕様

| 項目              | 内容                  | 使用先         | Matomo送信 | 必須        |
|-------------------|-----------------------|----------------|-------------|-------------|
| `site_id`         | クライアントの識別    | MatomoサイトID | ✅          | ✅          |
| `tracking_link_id`| 広告リンクの識別      | CD ID 1        | ✅          | ✅          |
| `session_id`      | セッションID（拡張用）| JWT内に保持    | ❌          | ❌（将来用） |

※ `tracking_link_id` のみCDとして使用

---

## 5. 🔑 JWT仕様（広告URL用トークン）

JWT ペイロード構成：

```json
{
  "lp_url": "https://client-site.com/landing",
  "site_id": "1",
  "custom_dimensions": {
    "1": "tracking_xyz456"
  },
  "exp": 1754880000
}
```

- RS256署名使用
- LPリダイレクト例：  
  `https://client-site.com/landing?trk=tracking_xyz456&site=1&sig=xxx.yyy.zzz`

---

## 6. 📦 Matomo設定

- 各クライアントごとに `site_id` を発行
- 使用するカスタムディメンション（ページビュー）

| ID | 名前               | スコープ     |
|----|--------------------|--------------|
| 1  | `tracking_link_id` | ページビュー |

---

## 7. 🧠 tag.js の仕様

- URLから `trk`, `site`, `sig` を取得し `/api/verify` に送信
- 検証OKで以下を実行：

```js
_paq.push(["setSiteId", site]);
_paq.push(["setCustomDimension", 1, trk]);
_paq.push(["trackPageView"]);
```

---

## 8. 🖥 クライアント管理画面仕様

- Matomo API を自社API経由で取得
- `tracking_link_id` ごとに集計 → 可視化（Recharts など）

---

## 9. 🔧 実装タスク一覧

| タスク                                         | 担当         | 優先度 |
|----------------------------------------------|--------------|--------|
| JWT発行・検証API（/issue, /click 等）        | Backend      | 高     |
| tag.js 実装（署名付きパラメータ検証）        | Frontend     | 高     |
| Matomoのカスタムディメンション設定           | Infra        | 中     |
| 管理画面のAPI設計およびグラフ描画（Recharts）| Backend/FE   | 中     |

---

## ✅ PM判断まとめ

- 現時点では `session_id` は **Matomo送信不要**
- `tracking_link_id` だけで要件を満たせる





