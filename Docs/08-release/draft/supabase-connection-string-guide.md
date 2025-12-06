# Supabase接続文字列取得ガイド

**作成日**: 2025年12月06日

## 現在のエラー

接続文字列を設定しましたが、以下のエラーが発生しています：

- **エラー**: `FATAL: Tenant or user not found`

これは、接続文字列の形式が正しくないか、パスワードが間違っている可能性があります。

## 解決方法

### 1. Supabaseダッシュボードから接続文字列を取得

**重要**: Supabaseダッシュボードから正確な接続文字列を取得してください。

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. **「Connect」ボタンをクリック**（プロジェクトダッシュボードの上部）
4. または、「Settings」→「Database」→「Connection string」にアクセス
5. **「Connection pooling」**セクションを確認
6. **「Session mode」**または**「Transaction mode」**の接続文字列をコピー

**接続文字列の取得URL**:
https://supabase.com/dashboard/project/lgxszszwyaeenofrmclt/settings/database

### 2. 接続文字列の形式

Supabaseの接続文字列には以下の形式があります：

#### Supavisor Session Mode（推奨、IPv4対応）
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
```

#### Supavisor Transaction Mode（サーバーレス向け、IPv4対応）
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

#### Direct Connection（IPv6のみ）
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**注意**: 
- `[PROJECT-REF]`はプロジェクトID（`lgxszszwyaeenofrmclt`）に置き換えます
- `[PASSWORD]`は、Supabaseプロジェクト作成時に設定したパスワードに置き換えます
- `[REGION]`はリージョン（`ap-south-1`）に置き換えます

### 3. .env.localファイルの更新

取得した接続文字列を`.env.local`ファイルに設定してください：

```bash
DATABASE_URL="[Supabaseダッシュボードから取得した接続文字列]"
```

**重要**: 接続文字列には既にパスワードが含まれているはずです。Supabaseダッシュボードから取得した接続文字列をそのまま使用してください。

### 4. 接続テスト

接続文字列を設定したら、以下のコマンドで接続をテストします：

```bash
# Prisma Clientを再生成
npx prisma generate

# データベース接続をテスト
npx prisma db pull
```

## 現在の設定

- **プロジェクトID**: `lgxszszwyaeenofrmclt`
- **リージョン**: `ap-south-1`
- **接続文字列形式**: Supavisor Session Mode（ポート5432）

## 確認事項

- [ ] Supabaseダッシュボードから接続文字列を取得した
- [ ] 接続文字列に`?sslmode=require`が含まれている
- [ ] 接続文字列にパスワードが含まれている
- [ ] `.env.local`ファイルに接続文字列が正しく設定されている
- [ ] `.env`ファイルからSQLite用の`DATABASE_URL`を削除した
- [ ] Prisma Clientが正常に生成される
- [ ] データベース接続が成功する

