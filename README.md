# RADIOH

ラジオリスナー向けのメール投稿アシスタント PWA。
番組・コーナーを登録しておくと、ワンタップで件名・ラジオネーム・署名入りのメールを作成してメーラーを起動できます。

## 機能

- **番組登録**: 番組名・宛先メールアドレス・サムネイル
- **コーナー登録**: 番組ごとにコーナー名・メール件名・定型文
- **メール投稿**: 番組 → コーナー → 本文入力 → メーラー起動（mailto:）
- **プロフィール**: ラジオネーム（冒頭に自動追加）と署名（末尾に自動追加、フリーフォーマット）
- **採用実績**: 送信済みメールに「採用された！」を記録。採用率・番組別実績・採用メール一覧
- **PWA**: ホーム画面に追加してアプリとして利用可能

## 開発

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## データ保存

- **Supabase 未設定時**: 端末内（localStorage）にのみ保存
- **Supabase 設定時**: ログイン制になり、クラウドに保存（複数端末で同期）

### Supabase のセットアップ

1. https://supabase.com でプロジェクトを作成（無料）
2. SQL Editor で `supabase/schema.sql` を実行
3. `.env.example` を `.env.local` にコピーし、Settings → API の URL と anon key を記入
4. （任意）Authentication → Sign In / Up → 「Confirm email」をオフにすると確認メールなしで登録できます

## デプロイ

Vercel 推奨。環境変数 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定してデプロイしてください。
PWA としてインストールするには HTTPS が必要です（Vercel なら自動）。
