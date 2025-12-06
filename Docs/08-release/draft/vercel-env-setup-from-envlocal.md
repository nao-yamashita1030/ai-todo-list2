# Vercel環境変数設定手順（.env.localから）

**作成日**: 2025年12月06日

## 概要

`.env.local`ファイルから環境変数を読み取り、Vercelに設定します。

## .env.localから読み取った環境変数

以下の環境変数が`.env.local`に設定されています：

### Clerk認証

- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: `pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ`
- **CLERK_SECRET_KEY**: `sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1`

### データベース

- **DATABASE_URL**: `file:./dev.db` (SQLite用 - Supabase用に変更が必要)

## Vercel環境変数の設定手順

### 1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYの設定

以下のコマンドを実行し、プロンプトが表示されたら値を入力してください：

```bash
# Development環境
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
# 入力値: pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ

# Preview環境
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
# 入力値: pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ

# Production環境（Live keyを使用する場合は、Clerkダッシュボードから取得）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# 入力値: pk_live_...（Clerkダッシュボードから取得）
```

### 2. CLERK_SECRET_KEYの設定

以下のコマンドを実行し、プロンプトが表示されたら値を入力してください：

```bash
# Development環境
vercel env add CLERK_SECRET_KEY development
# 入力値: sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# Preview環境
vercel env add CLERK_SECRET_KEY preview
# 入力値: sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# Production環境（Live keyを使用する場合は、Clerkダッシュボードから取得）
vercel env add CLERK_SECRET_KEY production
# 入力値: sk_live_...（Clerkダッシュボードから取得）
```

### 3. DATABASE_URLの設定

**重要**: `.env.local`の`DATABASE_URL`はSQLite用の設定になっています。Supabase用のPostgreSQL接続文字列に変更する必要があります。

Supabaseダッシュボードから接続文字列を取得してください：

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. 「Settings」→「Database」→「Connection string」にアクセス
4. 「Connection pooling」の接続文字列をコピー
5. 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

以下のコマンドを実行し、プロンプトが表示されたら接続文字列を入力してください：

```bash
# Development環境
vercel env add DATABASE_URL development
# 入力値: postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Preview環境
vercel env add DATABASE_URL preview
# 入力値: postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Production環境
vercel env add DATABASE_URL production
# 入力値: postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**注意**: `[PASSWORD]`は、Supabaseプロジェクト作成時に設定したパスワードに置き換えてください。

## 環境変数の確認

すべての環境変数を設定したら、以下のコマンドで確認します：

```bash
vercel env ls
```

## 自動化スクリプト（参考）

`scripts/setup-vercel-env.ps1`スクリプトを作成しましたが、`vercel env add`コマンドは対話的に値を入力する必要があるため、完全に自動化することはできません。

スクリプトは`.env.local`から値を読み取り、設定手順を表示します。

## 次のステップ

1. [ ] Clerkの環境変数をVercelに設定（Development、Preview、Production）
2. [ ] Supabaseの接続文字列を取得
3. [ ] DATABASE_URLをVercelに設定（Development、Preview、Production）
4. [ ] 環境変数の設定を確認（`vercel env ls`）
5. [ ] プレビューデプロイを実行して動作確認

