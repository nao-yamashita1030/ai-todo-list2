# 環境変数テンプレート

**作成日**: 2025年12月06日

## 必要な環境変数

### 1. DATABASE_URL

**Supabase接続文字列のテンプレート**:

```
postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**取得方法**:
1. Supabaseダッシュボード: https://supabase.com/dashboard
2. プロジェクト `ai-todo-list` を選択
3. 「Settings」→「Database」→「Connection string」
4. 「Connection pooling」の接続文字列をコピー
5. `[PASSWORD]` の部分を、プロジェクト作成時に設定したパスワードに置き換え

**注意**: パスワードは機密情報のため、このファイルには記載しません。

### 2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

**Clerk公開キーのテンプレート**:

- Test key: `pk_test_...`
- Live key: `pk_live_...`

**取得方法**:
1. Clerkダッシュボード: https://dashboard.clerk.com
2. アプリケーションを選択（未作成の場合は作成）
3. 「API Keys」にアクセス
4. 公開キーをコピー

### 3. CLERK_SECRET_KEY

**Clerkシークレットキーのテンプレート**:

- Test key: `sk_test_...`
- Live key: `sk_live_...`

**取得方法**:
1. Clerkダッシュボード: https://dashboard.clerk.com
2. アプリケーションを選択（未作成の場合は作成）
3. 「API Keys」にアクセス
4. シークレットキーをコピー

## Vercel CLIでの設定コマンド

以下のコマンドを実行して、環境変数を設定します：

```bash
# DATABASE_URL
vercel env add DATABASE_URL production
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け

vercel env add DATABASE_URL preview
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け

vercel env add DATABASE_URL development
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# プロンプトが表示されたら、ClerkのLive公開キー（pk_live_...）を貼り付け

vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
# プロンプトが表示されたら、ClerkのTest公開キー（pk_test_...）を貼り付け

vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
# プロンプトが表示されたら、ClerkのTest公開キー（pk_test_...）を貼り付け

# CLERK_SECRET_KEY
vercel env add CLERK_SECRET_KEY production
# プロンプトが表示されたら、ClerkのLiveシークレットキー（sk_live_...）を貼り付け

vercel env add CLERK_SECRET_KEY preview
# プロンプトが表示されたら、ClerkのTestシークレットキー（sk_test_...）を貼り付け

vercel env add CLERK_SECRET_KEY development
# プロンプトが表示されたら、ClerkのTestシークレットキー（sk_test_...）を貼り付け
```

## 注意事項

- すべての環境変数の値は機密情報です。このファイルには記載しません。
- Test keyとLive keyを混同しないように注意してください。
- 各環境（Production、Preview、Development）で適切な値を設定してください。

