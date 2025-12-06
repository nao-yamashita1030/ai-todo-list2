# Vercel環境変数手動設定手順

**作成日**: 2025年12月06日

## 概要

`.env.local`から読み取った環境変数をVercelに手動で設定します。

## .env.localから読み取った値

### Clerk認証

- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: `pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ`
- **CLERK_SECRET_KEY**: `sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1`

## 設定手順

### 1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYの設定

以下のコマンドを順番に実行し、プロンプトが表示されたら値を入力してください：

```bash
# Development環境
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → N
# プロンプト: "? What's the value of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?" → pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ

# Preview環境
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → N
# プロンプト: "? What's the value of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?" → pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ

# Production環境（Live keyを使用する場合は、Clerkダッシュボードから取得）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → N
# プロンプト: "? What's the value of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?" → pk_live_...（Clerkダッシュボードから取得）
```

### 2. CLERK_SECRET_KEYの設定

以下のコマンドを順番に実行し、プロンプトが表示されたら値を入力してください：

```bash
# Development環境
vercel env add CLERK_SECRET_KEY development
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of CLERK_SECRET_KEY?" → sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# Preview環境
vercel env add CLERK_SECRET_KEY preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of CLERK_SECRET_KEY?" → sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# Production環境（Live keyを使用する場合は、Clerkダッシュボードから取得）
vercel env add CLERK_SECRET_KEY production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of CLERK_SECRET_KEY?" → sk_live_...（Clerkダッシュボードから取得）
```

### 3. DATABASE_URLの設定

**重要**: `.env.local`の`DATABASE_URL`はSQLite用の設定になっています。Supabase用のPostgreSQL接続文字列に変更する必要があります。

Supabaseダッシュボードから接続文字列を取得してください：

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. 「Settings」→「Database」→「Connection string」にアクセス
4. 「Connection pooling」の接続文字列をコピー
5. 形式: `postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require`

以下のコマンドを順番に実行し、プロンプトが表示されたら接続文字列を入力してください：

```bash
# Development環境
vercel env add DATABASE_URL development
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of DATABASE_URL?" → postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Preview環境
vercel env add DATABASE_URL preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of DATABASE_URL?" → postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Production環境
vercel env add DATABASE_URL production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of DATABASE_URL?" → postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**注意**: `[PASSWORD]`は、Supabaseプロジェクト作成時に設定したパスワードに置き換えてください。

## 環境変数の確認

すべての環境変数を設定したら、以下のコマンドで確認します：

```bash
vercel env ls
```

## 設定完了チェックリスト

- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY（Development、Preview、Production）
- [ ] CLERK_SECRET_KEY（Development、Preview、Production）
- [ ] DATABASE_URL（Development、Preview、Production）
- [ ] 環境変数の設定を確認（`vercel env ls`）

