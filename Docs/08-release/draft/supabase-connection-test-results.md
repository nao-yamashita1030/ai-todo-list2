# Supabase接続テスト結果

**作成日**: 2025年12月06日

## テスト結果

### 1. MCPツールからの接続

✅ **成功**: MCPツールからは正常に接続できています
- SQLクエリの実行: 成功
- データベースバージョン: PostgreSQL 17.6
- テーブル一覧: 9テーブルすべて正常に作成済み

### 2. Prismaからの接続（ローカル環境）

❌ **失敗**: すべての接続文字列形式でエラーが発生

#### 試行1: Supavisor Session Mode（ポート5432）
```
postgresql://postgres.lgxszszwyaeenofrmclt:N_yamashita1030@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
```
**エラー**: `FATAL: Tenant or user not found`

#### 試行2: Supavisor Transaction Mode（ポート6543）
```
postgresql://postgres.lgxszszwyaeenofrmclt:N_yamashita1030@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```
**エラー**: `FATAL: Tenant or user not found`

#### 試行3: Direct Connection（IPv6、ポート5432）
```
postgresql://postgres:N_yamashita1030@db.lgxszszwyaeenofrmclt.supabase.co:5432/postgres?sslmode=require
```
**エラー**: `Can't reach database server`

## 問題の分析

### 考えられる原因

1. **接続文字列の形式が正しくない**
   - Supabaseダッシュボードから取得した接続文字列を使用する必要がある
   - 接続文字列には既にパスワードが含まれているはず

2. **パスワードが間違っている**
   - 現在のパスワード: `N_yamashita1030`
   - パスワードに特殊文字は含まれていない（URLエンコード不要）

3. **ネットワーク設定の問題**
   - IPv6がサポートされていない可能性
   - ファイアウォール設定の問題

4. **Supabaseプロジェクトの設定**
   - Connection poolingの設定が正しくない可能性
   - ネットワークアクセスの制限

## 解決方法

### 推奨: Supabaseダッシュボードから接続文字列を取得

1. Supabaseダッシュボードにアクセス: https://supabase.com/dashboard
2. プロジェクトを選択: `ai-todo-list`
3. **「Connect」ボタンをクリック**（プロジェクトダッシュボードの上部）
4. または、「Settings」→「Database」→「Connection string」にアクセス
5. **「Connection pooling」**セクションから接続文字列をコピー
6. 接続文字列には既にパスワードが含まれているはずです

**接続文字列の取得URL**:
https://supabase.com/dashboard/project/lgxszszwyaeenofrmclt/settings/database

### 代替方法: パスワードのリセット

1. Supabaseダッシュボード: 「Settings」→「Database」→「Database password」
2. 「Reset database password」をクリック
3. 新しいパスワードを設定
4. 新しいパスワードを使用して接続文字列を構築

## 現在の設定

- **プロジェクトID**: `lgxszszwyaeenofrmclt`
- **リージョン**: `ap-south-1`
- **データベース**: PostgreSQL 17.6
- **現在のパスワード**: `N_yamashita1030`（確認済み）

## 次のステップ

1. Supabaseダッシュボードから正確な接続文字列を取得
2. `.env.local`ファイルに接続文字列を設定
3. 接続テストを再実行

