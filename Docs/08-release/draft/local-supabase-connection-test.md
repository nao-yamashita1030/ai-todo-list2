# ローカル環境からSupabase接続テスト

**作成日**: 2025年12月06日

## 現在の状況

`.env.local`ファイルには、SQLite用の`DATABASE_URL`が設定されています：

```
DATABASE_URL="file:./dev.db"
```

## 必要な作業

### 1. .env.localにSupabase接続文字列を追加

`.env.local`ファイルに、Supabaseの接続文字列を追加する必要があります。

**接続文字列の形式**:
```
postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**注意**: `[PASSWORD]`は、Supabaseプロジェクト作成時に設定したパスワードに置き換えてください。

### 2. 接続文字列の取得方法

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. 「Settings」→「Database」→「Connection string」にアクセス
4. 「Connection pooling」の接続文字列をコピー
5. `.env.local`ファイルに追加

### 3. .env.localファイルの更新

`.env.local`ファイルを以下のように更新してください：

```bash
# Clerk認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# データベース（Supabase）
DATABASE_URL=postgresql://postgres.lgxszszwyaeenofrmclt:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require

# Created by Vercel CLI
VERCEL_OIDC_TOKEN=...
```

### 4. 接続テスト

接続文字列を設定したら、以下のコマンドで接続をテストします：

```bash
# Prisma Clientを再生成
npx prisma generate

# データベース接続をテスト
npx prisma db pull

# または、簡単なクエリでテスト
npx prisma studio
```

## 確認事項

- [ ] `.env.local`にSupabase接続文字列が設定されている
- [ ] `DATABASE_URL`が`postgresql://`で始まっている
- [ ] パスワードが正しく設定されている
- [ ] Prisma Clientが正常に生成される
- [ ] データベース接続が成功する

