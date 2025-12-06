# デプロイ準備ガイド

**作成日**: 2025年12月06日  
**対象バージョン**: v1.0.0

## 概要

本ガイドでは、TODOリスト管理WEBアプリケーションを本番環境にデプロイするための準備手順を説明します。

## 前提条件

- GitHubアカウント（リポジトリへのアクセス権限）
- Vercelアカウント
- Supabaseアカウント
- Clerkアカウント
- 必要な環境変数の情報

## デプロイ準備チェックリスト

### 1. コードの準備

- [x] すべてのコードがGitリポジトリにコミット・プッシュされている
- [x] mainブランチが最新の状態である
- [x] テストがすべて成功している（225テスト、すべて成功）
- [x] ビルドが正常に完了することを確認

### 2. Supabaseプロジェクトの準備

#### 2.1 Supabaseプロジェクトの作成

1. **Supabaseダッシュボードにアクセス**: https://supabase.com/dashboard
2. **新規プロジェクトを作成**:
   - 「New Project」をクリック
   - プロジェクト名を入力（例: `ai-todo-list2`）
   - データベースパスワードを設定（安全なパスワードを設定）
   - リージョンを選択（最適なリージョンを選択）
   - 「Create new project」をクリック
3. **プロジェクトの作成完了を待つ**: 数分かかる場合があります

#### 2.2 データベース接続情報の取得

1. **プロジェクト設定にアクセス**: プロジェクトダッシュボードの「Settings」→「Database」
2. **接続情報を確認**:
   - **Connection string**: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`
   - **Host**: データベースホスト名
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: プロジェクト作成時に設定したパスワード

#### 2.3 データベースマイグレーションの実行

1. **Prismaスキーマの更新**:
   - `prisma/schema.prisma` の `datasource` を確認
   - 現在は `sqlite` を使用しているため、`postgresql` に変更する必要があります（後述）

2. **環境変数の設定**:
   - `.env` ファイルに `DATABASE_URL` を設定（後述）

3. **マイグレーションの実行**:
   ```bash
   npx prisma migrate deploy
   ```
   または
   ```bash
   npx prisma db push
   ```

#### 2.4 バックアップ設定の確認

1. **Supabaseダッシュボード**: 「Settings」→「Database」→「Backups」
2. **自動バックアップの確認**: 無料プランでは自動バックアップが有効になっていることを確認
3. **バックアップスケジュールの確認**: 必要に応じてバックアップスケジュールを確認

### 3. Clerkプロジェクトの準備

#### 3.1 Clerkプロジェクトの作成

1. **Clerkダッシュボードにアクセス**: https://dashboard.clerk.com
2. **新規アプリケーションを作成**:
   - 「Create Application」をクリック
   - アプリケーション名を入力（例: `AI Todo List`）
   - 認証方法を選択（Email、Google、GitHubなど）
   - 「Create」をクリック

#### 3.2 APIキーの取得

1. **API Keysにアクセス**: アプリケーションダッシュボードの「API Keys」
2. **公開キー（Publishable Key）をコピー**: `pk_test_...` または `pk_live_...`
3. **シークレットキー（Secret Key）をコピー**: `sk_test_...` または `sk_live_...`

**注意**: 
- テスト環境では `pk_test_...` と `sk_test_...` を使用
- 本番環境では `pk_live_...` と `sk_live_...` を使用

#### 3.3 認証設定の確認

1. **認証方法の確認**: 「Authentication」→「Methods」で認証方法を確認
2. **リダイレクトURLの設定**: 「Authentication」→「Redirect URLs」でリダイレクトURLを設定
   - 開発環境: `http://localhost:3000`
   - 本番環境: `https://your-domain.vercel.app`

### 4. Vercelプロジェクトの準備

#### 4.1 Vercelプロジェクトの作成

1. **Vercelダッシュボードにアクセス**: https://vercel.com/dashboard
2. **新規プロジェクトを作成**:
   - 「Add New...」→「Project」をクリック
   - GitHubリポジトリを選択（またはインポート）
   - プロジェクト名を入力（例: `ai-todo-list2`）
   - フレームワークプリセットを選択（Next.js）
   - 「Deploy」をクリック

#### 4.2 環境変数の設定

1. **プロジェクト設定にアクセス**: プロジェクトダッシュボードの「Settings」→「Environment Variables」
2. **環境変数を追加**:

   **必須環境変数**:
   - `DATABASE_URL`: Supabaseのデータベース接続文字列
     - 形式: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerkの公開キー
     - 形式: `pk_test_...` または `pk_live_...`
   - `CLERK_SECRET_KEY`: Clerkのシークレットキー
     - 形式: `sk_test_...` または `sk_live_...`

   **環境の選択**:
   - Production（本番環境）
   - Preview（プレビュー環境）
   - Development（開発環境）

   **設定方法**:
   - 各環境変数の「Key」と「Value」を入力
   - 「Environment」で適用する環境を選択（Production、Preview、Development）
   - 「Save」をクリック

#### 4.3 ビルド設定の確認

1. **ビルド設定の確認**: 「Settings」→「General」→「Build & Development Settings」
2. **ビルドコマンド**: `npm run build` または `next build`
3. **出力ディレクトリ**: `.next`（Next.jsのデフォルト）
4. **インストールコマンド**: `npm install`

#### 4.4 ドメイン設定（オプション）

1. **ドメイン設定にアクセス**: 「Settings」→「Domains」
2. **カスタムドメインの追加**（必要に応じて）:
   - カスタムドメインを入力
   - DNS設定を確認
   - SSL証明書の設定（Vercelが自動的に管理）

### 5. Prismaスキーマの更新（SQLiteからPostgreSQLへ）

#### 5.1 スキーマファイルの更新

`prisma/schema.prisma` の `datasource` セクションを更新:

```prisma
datasource db {
  provider = "postgresql"  // sqlite から postgresql に変更
  url      = env("DATABASE_URL")
}
```

#### 5.2 変更のコミット

```bash
git add prisma/schema.prisma
git commit -m "chore: PrismaスキーマをPostgreSQLに更新"
git push origin main
```

### 6. 監視設定

#### 6.1 Vercel Analyticsの有効化

1. **Vercelダッシュボード**: プロジェクトの「Analytics」タブ
2. **Analyticsの有効化**: 「Enable Analytics」をクリック
3. **設定の確認**: パフォーマンス分析、エラー監視が有効になっていることを確認

#### 6.2 Supabase Dashboardの監視設定

1. **Supabaseダッシュボード**: プロジェクトの「Database」→「Monitoring」
2. **監視項目の確認**:
   - クエリパフォーマンス
   - 接続数
   - ストレージ使用量
3. **アラート設定**（必要に応じて）: 異常なアクセスパターンやパフォーマンス低下を検知

#### 6.3 Clerk Dashboardの監視設定

1. **Clerkダッシュボード**: アプリケーションの「Monitoring」
2. **監視項目の確認**:
   - ユーザー数
   - 認証エラー
   - セッション管理

### 7. ログ設定

#### 7.1 Vercelのログ設定

1. **Vercelダッシュボード**: プロジェクトの「Deployments」タブ
2. **ログの確認**: 各デプロイメントのログを確認
3. **ログの保持期間**: 無料プランでは30日間保持

#### 7.2 エラーログの確認

1. **Vercel Analytics**: 「Errors」タブでエラーログを確認
2. **Supabase Dashboard**: 「Logs」タブでデータベースログを確認
3. **Clerk Dashboard**: 「Logs」タブで認証ログを確認

### 8. デプロイ前の最終確認

#### 8.1 環境変数の確認

以下の環境変数が正しく設定されていることを確認:

- [ ] `DATABASE_URL`: Supabaseのデータベース接続文字列
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerkの公開キー
- [ ] `CLERK_SECRET_KEY`: Clerkのシークレットキー

#### 8.2 データベースマイグレーションの確認

- [ ] PrismaスキーマがPostgreSQL用に更新されている
- [ ] データベースマイグレーションが正常に完了している
- [ ] データベースにテーブルが正しく作成されている

#### 8.3 認証設定の確認

- [ ] ClerkのリダイレクトURLが正しく設定されている
- [ ] 認証方法が正しく設定されている

#### 8.4 ビルドの確認

- [ ] ローカル環境でビルドが正常に完了することを確認
- [ ] 型エラーがないことを確認
- [ ] Lintエラーがないことを確認

### 9. デプロイの実行

#### 9.1 ステージング環境へのデプロイ（推奨）

1. **プレビュー環境へのデプロイ**: 
   - GitHubのブランチにプッシュすると、自動的にプレビュー環境にデプロイされます
   - または、Vercelダッシュボードから手動でデプロイを実行

2. **動作確認**:
   - プレビューURLにアクセス
   - ログイン機能の確認
   - TODO作成機能の確認
   - プロジェクト作成機能の確認
   - コメント機能の確認
   - 検索・フィルタリング機能の確認

#### 9.2 本番環境へのデプロイ

1. **mainブランチへのマージ**: 
   - すべての確認が完了したら、mainブランチにマージ
   - Vercelが自動的に本番環境にデプロイ

2. **手動デプロイ**（必要に応じて）:
   - Vercelダッシュボードから手動でデプロイを実行

3. **動作確認**:
   - 本番URLにアクセス
   - すべての機能が正常に動作することを確認

### 10. デプロイ後の確認

#### 10.1 リリース直後の確認

- [ ] アプリケーションが正常に起動している
- [ ] ログイン機能が正常に動作する
- [ ] TODO作成機能が正常に動作する
- [ ] プロジェクト作成機能が正常に動作する
- [ ] エラーログが出力されていない

#### 10.2 監視の確認

- [ ] Vercel Analyticsが正常に動作している
- [ ] Supabase Dashboardでデータベース接続が正常であることを確認
- [ ] Clerk Dashboardで認証が正常に動作していることを確認

#### 10.3 パフォーマンスの確認

- [ ] レスポンスタイムが3秒以内であることを確認
- [ ] エラー率が低いことを確認
- [ ] リソース使用率が適切であることを確認

## トラブルシューティング

### よくある問題と解決方法

#### データベース接続エラー

**問題**: `DATABASE_URL` が正しく設定されていない、または接続できない

**解決方法**:
1. Supabaseの接続情報を再確認
2. パスワードが正しいことを確認
3. SSLモードが `require` になっていることを確認
4. ファイアウォール設定を確認

#### 認証エラー

**問題**: Clerkの認証が動作しない

**解決方法**:
1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` と `CLERK_SECRET_KEY` が正しく設定されていることを確認
2. リダイレクトURLが正しく設定されていることを確認
3. テスト環境と本番環境でキーが異なることを確認

#### ビルドエラー

**問題**: Vercelでのビルドが失敗する

**解決方法**:
1. ローカル環境でビルドが成功することを確認
2. 環境変数が正しく設定されていることを確認
3. Node.jsのバージョンを確認
4. ビルドログを確認してエラー内容を特定

## 次のステップ

デプロイ準備が完了したら、以下のステップに進みます：

1. **ステージング環境へのデプロイ**: プレビュー環境で動作確認
2. **本番環境へのデプロイ**: 本番環境にデプロイ
3. **リリース後の確認**: デプロイ後の動作確認

## 参考資料

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 注意事項

- 環境変数は機密情報のため、Gitにコミットしないでください
- 本番環境の環境変数は、必ずVercelダッシュボードで設定してください
- データベースパスワードは安全に管理してください
- デプロイ前に必ずバックアップを取得してください

