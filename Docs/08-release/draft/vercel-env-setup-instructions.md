# Vercel環境変数設定手順書

**作成日**: 2025年12月06日  
**プロジェクト**: `ai-todo-list2`

## 概要

本ドキュメントでは、Vercel CLIを使用して環境変数を設定する手順を説明します。

## 前提条件

- ✅ Vercel CLIがインストール済み（v49.1.1）
- ✅ Vercelアカウントにログイン済み
- ✅ Vercelプロジェクトがリンク済み（`ai-todo-list2`）
- ✅ Supabaseプロジェクトが作成済み（`ai-todo-list`）
- ⚠️ Clerkアプリケーションが作成済み（未作成の場合は作成が必要）

## 1. Supabase接続文字列の取得

### 1.1 Supabaseダッシュボードから取得

1. **Supabaseダッシュボードにアクセス**: https://supabase.com/dashboard
2. **プロジェクトを選択**: `ai-todo-list` を選択
3. **Settingsにアクセス**: 左側メニューの「Settings」→「Database」
4. **接続文字列をコピー**:
   - 「Connection string」セクションを確認
   - **Connection pooling** の接続文字列をコピー（推奨）
   - 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`
   - **注意**: `[PASSWORD]` の部分は、プロジェクト作成時に設定したパスワードに置き換えます

### 1.2 接続文字列の形式

**プロジェクト情報**:
- プロジェクトID: `lgxszszwyaeenofrmclt`
- Host: `db.lgxszszwyaeenofrmclt.supabase.co`
- リージョン: `ap-south-1`

**接続文字列の例**:
```
postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**注意**: `[PASSWORD]` は、Supabaseプロジェクト作成時に設定したパスワードに置き換えてください。

## 2. Clerk APIキーの取得

### 2.1 Clerkダッシュボードから取得

1. **Clerkダッシュボードにアクセス**: https://dashboard.clerk.com
2. **アプリケーションを選択**（未作成の場合は作成）
3. **API Keysにアクセス**: 左側メニューの「API Keys」
4. **公開キーをコピー**:
   - Test key: `pk_test_...`
   - Live key: `pk_live_...`（本番環境用）
5. **シークレットキーをコピー**:
   - Test key: `sk_test_...`
   - Live key: `sk_live_...`（本番環境用）

## 3. Vercel CLIで環境変数を設定

### 3.1 DATABASE_URLの設定

```bash
# Production環境
vercel env add DATABASE_URL production
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け

# Preview環境
vercel env add DATABASE_URL preview
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け

# Development環境
vercel env add DATABASE_URL development
# プロンプトが表示されたら、Supabaseの接続文字列を貼り付け
```

### 3.2 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEYの設定

```bash
# Production環境（Live keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# プロンプトが表示されたら、ClerkのLive公開キー（pk_live_...）を貼り付け

# Preview環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
# プロンプトが表示されたら、ClerkのTest公開キー（pk_test_...）を貼り付け

# Development環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
# プロンプトが表示されたら、ClerkのTest公開キー（pk_test_...）を貼り付け
```

### 3.3 CLERK_SECRET_KEYの設定

```bash
# Production環境（Live keyを使用）
vercel env add CLERK_SECRET_KEY production
# プロンプトが表示されたら、ClerkのLiveシークレットキー（sk_live_...）を貼り付け

# Preview環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY preview
# プロンプトが表示されたら、ClerkのTestシークレットキー（sk_test_...）を貼り付け

# Development環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY development
# プロンプトが表示されたら、ClerkのTestシークレットキー（sk_test_...）を貼り付け
```

## 4. 環境変数の確認

### 4.1 環境変数の一覧確認

```bash
vercel env ls
```

すべての環境変数が正しく設定されていることを確認します。

### 4.2 環境変数の詳細確認

```bash
# 特定の環境変数の値を確認（マスクされた形式で表示）
vercel env ls | grep DATABASE_URL
vercel env ls | grep CLERK
```

## 5. デプロイの実行

### 5.1 プレビューデプロイ

```bash
# プレビューデプロイを実行
vercel
```

### 5.2 本番デプロイ

```bash
# 本番環境にデプロイ
vercel --prod
```

## 6. デプロイ後の確認

### 6.1 デプロイログの確認

```bash
# 最新のデプロイログを確認
vercel logs
```

### 6.2 動作確認

1. **Production URLにアクセス**: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
2. **ログイン機能の確認**: ログインボタンが表示されることを確認
3. **ログイン動作の確認**: ログインが正常に動作することを確認
4. **TODO機能の確認**: TODO作成、一覧表示が正常に動作することを確認

## 7. ClerkのRedirect URLs設定

VercelプロジェクトのURLを確認したら、ClerkのRedirect URLsに追加します：

1. **Clerkダッシュボード**: 「Authentication」→「Redirect URLs」
2. **以下のURLを追加**:
   - 本番環境: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
   - プレビュー環境: `https://ai-todo-list2-*-nao-yamashita1030s-projects.vercel.app`（ワイルドカード）

## 8. トラブルシューティング

### よくある問題と解決方法

#### 環境変数が読み込まれない

**問題**: 環境変数が正しく読み込まれていない

**解決方法**:
1. `vercel env ls` で環境変数が設定されていることを確認
2. デプロイを再実行: `vercel --prod`
3. 環境変数名が正しいことを確認（大文字小文字に注意）

#### デプロイエラー

**問題**: デプロイが失敗する

**解決方法**:
1. ビルドログを確認: `vercel logs`
2. ローカル環境でビルドが成功することを確認: `npm run build`
3. 環境変数が正しく設定されていることを確認

## 参考資料

- [Vercel設定ガイド（CLI使用）](./vercel-setup-guide.md)
- [Vercel環境変数設定チェックリスト](./vercel-env-setup-checklist.md)
- [Supabase設定完了レポート](./supabase-setup-complete.md)
- [Clerk設定ガイド](./clerk-setup-guide.md)

