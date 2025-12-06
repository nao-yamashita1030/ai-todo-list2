# Vercel環境変数設定チェックリスト

**作成日**: 2025年12月06日  
**プロジェクト**: `ai-todo-list2`

## 現在の状況

- ✅ Vercelプロジェクトが存在: `ai-todo-list2`
- ✅ プロジェクトURL: `https://ai-todo-list2-nao-yamashita1030s-projects.vercel.app`
- ✅ プロジェクトがリンク済み
- ⚠️ 環境変数が未設定

## 設定が必要な環境変数

### 1. DATABASE_URL

**取得方法**:
1. Supabaseダッシュボード: https://supabase.com/dashboard
2. プロジェクト `ai-todo-list` を選択
3. 「Settings」→「Database」→「Connection string」
4. 「Connection pooling」の接続文字列をコピー
5. 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

**設定コマンド**:
```bash
# Production環境
vercel env add DATABASE_URL production

# Preview環境
vercel env add DATABASE_URL preview

# Development環境
vercel env add DATABASE_URL development
```

**ステータス**: [ ] 未設定

### 2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

**取得方法**:
1. Clerkダッシュボード: https://dashboard.clerk.com
2. アプリケーションを選択
3. 「API Keys」にアクセス
4. Test key（`pk_test_...`）またはLive key（`pk_live_...`）をコピー

**設定コマンド**:
```bash
# Production環境（Live keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# Preview環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview

# Development環境（Test keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development
```

**ステータス**: [ ] 未設定

### 3. CLERK_SECRET_KEY

**取得方法**:
1. Clerkダッシュボード: https://dashboard.clerk.com
2. アプリケーションを選択
3. 「API Keys」にアクセス
4. Test key（`sk_test_...`）またはLive key（`sk_live_...`）をコピー

**設定コマンド**:
```bash
# Production環境（Live keyを使用）
vercel env add CLERK_SECRET_KEY production

# Preview環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY preview

# Development環境（Test keyを使用）
vercel env add CLERK_SECRET_KEY development
```

**ステータス**: [ ] 未設定

## 設定手順

### ステップ1: Supabase接続文字列の取得

1. Supabaseダッシュボードにアクセス
2. プロジェクト `ai-todo-list` を選択
3. 「Settings」→「Database」→「Connection string」
4. 「Connection pooling」の接続文字列をコピー

### ステップ2: Clerk APIキーの取得

1. Clerkダッシュボードにアクセス
2. アプリケーションを選択（未作成の場合は作成）
3. 「API Keys」にアクセス
4. Test keyとLive keyをコピー

### ステップ3: 環境変数の設定

上記のコマンドを実行して、各環境変数を設定します。

### ステップ4: 環境変数の確認

```bash
# 環境変数の一覧を確認
vercel env ls
```

### ステップ5: デプロイの実行

```bash
# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod
```

## 設定完了後の確認

- [ ] すべての環境変数が設定されている
- [ ] デプロイが正常に完了している
- [ ] アプリケーションが正常に動作している
- [ ] ログイン機能が正常に動作している
- [ ] ClerkのRedirect URLsが設定されている

## 注意事項

- 環境変数の値は機密情報のため、このファイルには記載しません
- Test keyとLive keyを混同しないように注意してください
- 各環境（Production、Preview、Development）で適切な値を設定してください

## 参考資料

- [Vercel設定ガイド（CLI使用）](./vercel-setup-guide.md)
- [Supabase設定完了レポート](./supabase-setup-complete.md)
- [Clerk設定ガイド](./clerk-setup-guide.md)

