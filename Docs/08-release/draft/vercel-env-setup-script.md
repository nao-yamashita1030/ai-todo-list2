# Vercel環境変数設定スクリプト

**作成日**: 2025年12月06日

## 概要

このドキュメントでは、Vercel CLIを使用して環境変数を設定するためのコマンドを記載します。

## 必要な情報

以下の情報を準備してください：

1. **DATABASE_URL**: Supabaseの接続文字列（パスワードが必要）
2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clerkの公開キー
3. **CLERK_SECRET_KEY**: Clerkのシークレットキー

## 設定コマンド

以下のコマンドを順番に実行してください。各コマンド実行時に、プロンプトが表示されるので、対応する値を入力してください。

### DATABASE_URLの設定

```bash
# Production環境
vercel env add DATABASE_URL production

# Preview環境
vercel env add DATABASE_URL preview

# Development環境
vercel env add DATABASE_URL development
```

**入力値**: Supabaseの接続文字列
- 形式: `postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require`
- `[PASSWORD]` は、Supabaseプロジェクト作成時に設定したパスワードに置き換えてください

### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYの設定

```bash
# Production環境（Live keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# Preview環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

# Development環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
```

**入力値**: Clerkの公開キー
- Production: `pk_live_...`
- Preview/Development: `pk_test_...`

### CLERK_SECRET_KEYの設定

```bash
# Production環境（Live keyを使用）
vercel env add CLERK_SECRET_KEY production

# Preview環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY preview

# Development環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY development
```

**入力値**: Clerkのシークレットキー
- Production: `sk_live_...`
- Preview/Development: `sk_test_...`

## 環境変数の確認

すべての環境変数を設定したら、以下のコマンドで確認します：

```bash
vercel env ls
```

## 注意事項

- 各コマンド実行時に、プロンプトが表示されます
- 値を入力する際は、コピー&ペーストを使用することを推奨します
- 環境変数の値は機密情報のため、慎重に取り扱ってください

