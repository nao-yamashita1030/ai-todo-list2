# 環境変数設定状況

**作成日**: 2025年12月06日

## 現在の状況

### .env.localファイルの確認結果

現在、`.env.local`ファイルには以下の環境変数のみが設定されています：

- `VERCEL_OIDC_TOKEN`: 設定済み

### 必要な環境変数

以下の環境変数が`.env.local`に設定されている必要があります：

1. **DATABASE_URL**: Supabaseの接続文字列
2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clerkの公開キー
3. **CLERK_SECRET_KEY**: Clerkのシークレットキー

## 次のステップ

### オプション1: .env.localに環境変数を追加する

`.env.local`ファイルに以下の環境変数を追加してください：

```bash
# Supabase
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### オプション2: .env.localからVercelに環境変数を設定する

`.env.local`に環境変数が既に設定されている場合、以下のコマンドでVercelに設定できます：

```bash
# .env.localから環境変数を読み取り、Vercelに設定
# （各コマンド実行時に、プロンプトが表示されるので、値を入力してください）

# DATABASE_URL
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development

# CLERK_SECRET_KEY
vercel env add CLERK_SECRET_KEY production
vercel env add CLERK_SECRET_KEY preview
vercel env add CLERK_SECRET_KEY development
```

## 確認事項

- [ ] `.env.local`に`DATABASE_URL`が設定されている
- [ ] `.env.local`に`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`が設定されている
- [ ] `.env.local`に`CLERK_SECRET_KEY`が設定されている
- [ ] Vercelに環境変数が設定されている

