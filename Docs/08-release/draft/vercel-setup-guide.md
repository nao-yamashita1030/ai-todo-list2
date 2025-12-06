# Vercel設定ガイド（CLI使用）

**作成日**: 2025年12月06日  
**対象バージョン**: v1.0.0

## 概要

本ガイドでは、Vercel CLIを使用してVercelプロジェクトの設定を行う手順を説明します。

## 前提条件

- Vercel CLIがインストールされている（確認済み: v49.1.1）
- Vercelアカウントにログインしている（確認済み: `nao-yamashita1030`）
- Vercelプロジェクトが存在する（確認済み: `ai-todo-list2`）
- プロジェクトがリンクされている（確認済み）

## 1. プロジェクトの確認

### 1.1 プロジェクトの状態確認

```bash
# ログイン状態の確認
vercel whoami

# プロジェクト一覧の確認
vercel projects ls

# プロジェクトのリンク確認
vercel link
```

**確認結果**:
- ✅ ログイン済み: `nao-yamashita1030`
- ✅ プロジェクト存在: `ai-todo-list2`
- ✅ プロジェクトURL: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
- ✅ プロジェクトリンク済み

## 2. 環境変数の設定

### 2.1 現在の環境変数の確認

```bash
# 環境変数の一覧を確認
vercel env ls
```

### 2.2 環境変数の追加

以下の環境変数をVercel CLIで設定します：

#### 2.2.1 DATABASE_URL（Supabase接続文字列）

**Supabaseダッシュボードから接続文字列を取得**:
1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクト `ai-todo-list` を選択
3. 「Settings」→「Database」にアクセス
4. 「Connection string」セクションで「Connection pooling」の接続文字列をコピー
5. 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

**Vercel CLIで設定**:
```bash
# Production環境
vercel env add DATABASE_URL production

# Preview環境
vercel env add DATABASE_URL preview

# Development環境
vercel env add DATABASE_URL development
```

各コマンド実行時に、接続文字列を入力します。

#### 2.2.2 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

**Clerkダッシュボードから公開キーを取得**:
1. Clerkダッシュボードにアクセス: https://dashboard.clerk.com
2. アプリケーションを選択
3. 「API Keys」にアクセス
4. Test key（`pk_test_...`）またはLive key（`pk_live_...`）をコピー

**Vercel CLIで設定**:
```bash
# Production環境（Live keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# Preview環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

# Development環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
```

各コマンド実行時に、APIキーを入力します。

#### 2.2.3 CLERK_SECRET_KEY

**Clerkダッシュボードからシークレットキーを取得**:
1. Clerkダッシュボードにアクセス: https://dashboard.clerk.com
2. アプリケーションを選択
3. 「API Keys」にアクセス
4. Test key（`sk_test_...`）またはLive key（`sk_live_...`）をコピー

**Vercel CLIで設定**:
```bash
# Production環境（Live keyを使用）
vercel env add CLERK_SECRET_KEY production

# Preview環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY preview

# Development環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY development
```

各コマンド実行時に、シークレットキーを入力します。

### 2.3 環境変数の確認

```bash
# 環境変数の一覧を確認
vercel env ls
```

すべての環境変数が正しく設定されていることを確認します。

## 3. デプロイの実行

### 3.1 プレビューデプロイ

```bash
# プレビューデプロイを実行
vercel
```

### 3.2 本番デプロイ

```bash
# 本番環境にデプロイ
vercel --prod
```

### 3.4 デプロイの確認

デプロイ後、以下のURLでアクセスできます：

- **Production URL**: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
- **Preview URL**: 各ブランチごとに生成されるURL

## 4. ClerkのRedirect URLs設定

VercelプロジェクトのURLを確認したら、ClerkのRedirect URLsに追加します：

1. **Clerkダッシュボード**: 「Authentication」→「Redirect URLs」
2. **以下のURLを追加**:
   - 本番環境: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
   - プレビュー環境: `https://ai-todo-list2-*-nao-yamashita1030s-projects.vercel.app`（ワイルドカード）

## 5. 動作確認

### 5.1 デプロイ後の確認

1. **Production URLにアクセス**: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
2. **ログイン機能の確認**: ログインボタンが表示されることを確認
3. **ログイン動作の確認**: ログインが正常に動作することを確認
4. **TODO機能の確認**: TODO作成、一覧表示が正常に動作することを確認
5. **プロジェクト機能の確認**: プロジェクト作成、一覧表示が正常に動作することを確認

### 5.2 エラーの確認

1. **Vercelダッシュボード**: デプロイログを確認
2. **ブラウザコンソール**: エラーメッセージを確認
3. **Vercel Analytics**: エラーログを確認

## 6. トラブルシューティング

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
1. ビルドログを確認: Vercelダッシュボードの「Deployments」タブ
2. ローカル環境でビルドが成功することを確認: `npm run build`
3. 環境変数が正しく設定されていることを確認

#### 認証エラー

**問題**: ログインできない

**解決方法**:
1. ClerkのRedirect URLsが正しく設定されていることを確認
2. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` と `CLERK_SECRET_KEY` が正しく設定されていることを確認
3. Test keyとLive keyを混同していないことを確認

## 7. 次のステップ

Vercelの設定が完了したら、以下のステップに進みます：

1. **動作確認**: デプロイ後の動作確認
2. **ClerkのRedirect URLs設定**: VercelのURLをClerkに追加
3. **リリース後の確認**: リリース直後の確認項目を実施

## 参考資料

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [外部サービス設定手順書](./external-services-setup.md)

