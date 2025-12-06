# Supabase接続トラブルシューティング

**作成日**: 2025年12月06日

## 現在の状況

ローカル環境からSupabaseへの接続でエラーが発生しています。

### 試行した接続文字列

1. **Direct connection形式**:
   ```
   postgresql://postgres:N_yamashita1030@db.lgxszszwyaeenofrmclt.supabase.co:5432/postgres
   ```
   - エラー: `Can't reach database server`

2. **Connection pooling形式**:
   ```
   postgresql://postgres.lgxszszwyaeenofrmclt:N_yamashita1030@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
   - エラー: `FATAL: Tenant or user not found`

## 解決方法

### 1. Supabaseダッシュボードから接続文字列を取得

Supabaseダッシュボードから正確な接続文字列を取得してください：

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. 「Settings」→「Database」→「Connection string」にアクセス
4. **「Connection pooling」**の接続文字列をコピー
5. 接続文字列には既にパスワードが含まれているはずです

### 2. 接続文字列の形式

Supabaseの接続文字列は通常、以下の形式です：

**Connection pooling（推奨）**:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**Direct connection**:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

### 3. ネットワーク設定の確認

Supabaseのネットワーク設定を確認してください：

1. Supabaseダッシュボード: 「Settings」→「Database」→「Connection pooling」
2. **「Allow connections from any IP address」**が有効になっているか確認
3. 無効の場合は、有効にするか、特定のIPアドレスを許可リストに追加

### 4. パスワードの確認

接続文字列に含まれるパスワードが正しいか確認してください：

1. Supabaseダッシュボード: 「Settings」→「Database」→「Database password」
2. パスワードをリセットする場合は、「Reset database password」をクリック

### 5. .env.localファイルの更新

取得した接続文字列を`.env.local`ファイルに設定してください：

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
```

**注意**: 引用符は必要に応じて使用してください。接続文字列に特殊文字が含まれている場合は、引用符で囲む必要があります。

### 6. 接続テスト

接続文字列を設定したら、以下のコマンドで接続をテストします：

```bash
# Prisma Clientを再生成
npx prisma generate

# データベース接続をテスト
npx prisma db pull
```

## 確認事項

- [ ] Supabaseダッシュボードから接続文字列を取得した
- [ ] 接続文字列に`?sslmode=require`が含まれている
- [ ] ネットワーク設定で「Allow connections from any IP address」が有効になっている
- [ ] パスワードが正しい
- [ ] `.env.local`ファイルに接続文字列が正しく設定されている
- [ ] Prisma Clientが正常に生成される
- [ ] データベース接続が成功する

