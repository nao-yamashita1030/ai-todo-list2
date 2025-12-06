# 外部サービス設定手順書

**作成日**: 2025年12月06日  
**対象バージョン**: v1.0.0

## 概要

本ドキュメントでは、TODOリスト管理WEBアプリケーションのデプロイに必要な外部サービス（Supabase、Clerk、Vercel）の設定手順を説明します。

## 前提条件

- 各サービスのアカウントを持っていること
  - Supabaseアカウント: https://supabase.com
  - Clerkアカウント: https://clerk.com
  - Vercelアカウント: https://vercel.com
- GitHubアカウント（Vercelと連携する場合）

## 1. Supabaseプロジェクトの作成

### 1.1 Supabaseアカウントの準備

1. **Supabaseにアクセス**: https://supabase.com
2. **アカウント作成**（未登録の場合）:
   - 「Start your project」をクリック
   - GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録
3. **ログイン**: 既存アカウントの場合はログイン

### 1.2 新規プロジェクトの作成

1. **ダッシュボードにアクセス**: https://supabase.com/dashboard
2. **新規プロジェクトを作成**:
   - 「New Project」ボタンをクリック
   - 以下の情報を入力:
     - **Organization**: 既存の組織を選択、または新規作成
     - **Name**: プロジェクト名（例: `ai-todo-list2`）
     - **Database Password**: 安全なパスワードを設定（**重要**: このパスワードは後で使用します）
     - **Region**: 最適なリージョンを選択（例: `Northeast Asia (Tokyo)`）
     - **Pricing Plan**: Freeプランを選択（無料プランで開始）
3. **プロジェクトの作成**:
   - 「Create new project」ボタンをクリック
   - プロジェクトの作成には数分かかります（通常2-3分）

### 1.3 データベース接続情報の取得

1. **プロジェクトダッシュボードにアクセス**: 作成したプロジェクトを選択
2. **Settingsにアクセス**: 左側メニューの「Settings」→「Database」
3. **接続情報を確認**:
   - **Connection string**: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Connection pooling**: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Direct connection**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **Host**: `db.[PROJECT-REF].supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`（Direct connection）または `6543`（Connection pooling）
   - **User**: `postgres`
   - **Password**: プロジェクト作成時に設定したパスワード

4. **接続文字列のコピー**:
   - **推奨**: Connection poolingの接続文字列を使用
   - 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`
   - この接続文字列を後でVercelの環境変数 `DATABASE_URL` に設定します

### 1.4 バックアップ設定の確認

1. **Settings → Database → Backups** にアクセス
2. **自動バックアップの確認**:
   - 無料プランでは自動バックアップが有効になっていることを確認
   - バックアップスケジュールを確認（通常は日次）

### 1.5 APIキーの取得（オプション）

1. **Settings → API** にアクセス
2. **API Keysを確認**:
   - `anon` `public` キー: フロントエンドで使用（今回は使用しない）
   - `service_role` `secret` キー: サーバーサイドで使用（今回は使用しない）
   - **注意**: 今回はPrismaを使用するため、接続文字列のみで十分です

## 2. Clerkプロジェクトの作成

### 2.1 Clerkアカウントの準備

1. **Clerkにアクセス**: https://clerk.com
2. **アカウント作成**（未登録の場合）:
   - 「Sign up」をクリック
   - GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録
3. **ログイン**: 既存アカウントの場合はログイン

### 2.2 新規アプリケーションの作成

1. **ダッシュボードにアクセス**: https://dashboard.clerk.com
2. **新規アプリケーションを作成**:
   - 「Create Application」ボタンをクリック
   - 以下の情報を入力:
     - **Application name**: アプリケーション名（例: `AI Todo List`）
     - **Authentication methods**: 認証方法を選択
       - **Email**: 必須（チェック）
       - **Google**: オプション（必要に応じて）
       - **GitHub**: オプション（必要に応じて）
       - その他の認証方法も選択可能
3. **アプリケーションの作成**:
   - 「Create Application」ボタンをクリック
   - アプリケーションが作成されます

### 2.3 APIキーの取得

1. **API Keysにアクセス**: 左側メニューの「API Keys」
2. **公開キー（Publishable Key）をコピー**:
   - **Test key**: `pk_test_...` で始まるキー
   - **Live key**: `pk_live_...` で始まるキー（本番環境用）
   - **開発・テスト環境**: Test keyを使用
   - **本番環境**: Live keyを使用
   - このキーを後でVercelの環境変数 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` に設定します

3. **シークレットキー（Secret Key）をコピー**:
   - **Test key**: `sk_test_...` で始まるキー
   - **Live key**: `sk_live_...` で始まるキー（本番環境用）
   - **開発・テスト環境**: Test keyを使用
   - **本番環境**: Live keyを使用
   - このキーを後でVercelの環境変数 `CLERK_SECRET_KEY` に設定します

**重要**: 
- シークレットキーは機密情報です。絶対に公開しないでください
- テスト環境と本番環境で異なるキーを使用します

### 2.4 認証設定の確認

1. **Authentication → Methods** にアクセス
2. **認証方法の確認**:
   - Email認証が有効になっていることを確認
   - その他の認証方法も必要に応じて設定

3. **Redirect URLsの設定**:
   - **Authentication → Redirect URLs** にアクセス
   - 以下のURLを追加:
     - **開発環境**: `http://localhost:3000`
     - **プレビュー環境**: `https://your-preview-url.vercel.app`（Vercelプロジェクト作成後に設定）
     - **本番環境**: `https://your-domain.vercel.app`（Vercelプロジェクト作成後に設定）
   - 「Save」をクリック

### 2.5 その他の設定（オプション）

1. **User & Authentication → Email**: メールテンプレートのカスタマイズ
2. **User & Authentication → Sessions**: セッション設定
3. **User & Authentication → Multi-factor**: 多要素認証の設定（オプション）

## 3. Vercelプロジェクトの作成

### 3.1 Vercelアカウントの準備

1. **Vercelにアクセス**: https://vercel.com
2. **アカウント作成**（未登録の場合）:
   - 「Sign Up」をクリック
   - GitHubアカウントでサインアップ（推奨）
3. **ログイン**: 既存アカウントの場合はログイン

### 3.2 GitHubリポジトリの連携

1. **ダッシュボードにアクセス**: https://vercel.com/dashboard
2. **GitHubアカウントの連携**（未連携の場合）:
   - 「Add New...」→「Project」をクリック
   - 「Import Git Repository」を選択
   - GitHubアカウントを連携（必要に応じて）
   - リポジトリへのアクセス権限を付与

### 3.3 新規プロジェクトの作成

1. **プロジェクトのインポート**:
   - 「Add New...」→「Project」をクリック
   - GitHubリポジトリを選択（例: `nao-yamashita1030/ai-todo-list2`）
   - 「Import」をクリック

2. **プロジェクト設定**:
   - **Project Name**: プロジェクト名（例: `ai-todo-list2`）
   - **Framework Preset**: `Next.js` を選択（自動検出される場合があります）
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build` または `next build`（自動検出）
   - **Output Directory**: `.next`（Next.jsのデフォルト、自動検出）
   - **Install Command**: `npm install`（自動検出）

3. **環境変数の設定**（後で設定するため、ここではスキップ）:
   - 「Environment Variables」セクションは後で設定します
   - 一旦「Deploy」をクリックしてプロジェクトを作成

4. **プロジェクトの作成**:
   - 「Deploy」ボタンをクリック
   - 初回デプロイが開始されます（環境変数が設定されていないため、エラーになる可能性があります）

### 3.4 プロジェクトURLの確認

1. **プロジェクトダッシュボードにアクセス**: 作成したプロジェクトを選択
2. **URLの確認**:
   - **Production URL**: `https://your-project-name.vercel.app`
   - **Preview URL**: 各ブランチごとにプレビューURLが生成されます
   - これらのURLをClerkのRedirect URLsに追加します

## 4. 環境変数の設定

### 4.1 Vercelでの環境変数設定

1. **プロジェクト設定にアクセス**: Vercelダッシュボードでプロジェクトを選択
2. **Settings → Environment Variables** にアクセス
3. **環境変数を追加**:

   #### 必須環境変数

   **1. DATABASE_URL**
   - **Key**: `DATABASE_URL`
   - **Value**: Supabaseの接続文字列
     - 形式: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`
     - Supabaseの「Settings → Database → Connection string」から取得
   - **Environment**: 
     - ✅ Production（本番環境）
     - ✅ Preview（プレビュー環境）
     - ✅ Development（開発環境）
   - 「Save」をクリック

   **2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: Clerkの公開キー
     - テスト環境: `pk_test_...`（Clerkの「API Keys」から取得）
     - 本番環境: `pk_live_...`（Clerkの「API Keys」から取得）
   - **Environment**: 
     - ✅ Production（本番環境）: Live keyを使用
     - ✅ Preview（プレビュー環境）: Test keyを使用
     - ✅ Development（開発環境）: Test keyを使用
   - 「Save」をクリック

   **3. CLERK_SECRET_KEY**
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: Clerkのシークレットキー
     - テスト環境: `sk_test_...`（Clerkの「API Keys」から取得）
     - 本番環境: `sk_live_...`（Clerkの「API Keys」から取得）
   - **Environment**: 
     - ✅ Production（本番環境）: Live keyを使用
     - ✅ Preview（プレビュー環境）: Test keyを使用
     - ✅ Development（開発環境）: Test keyを使用
   - 「Save」をクリック

### 4.2 環境変数の確認

1. **環境変数の一覧を確認**:
   - すべての環境変数が正しく設定されていることを確認
   - 各環境（Production、Preview、Development）で適切な値が設定されていることを確認

2. **環境変数のテスト**（オプション）:
   - プレビュー環境でデプロイを実行
   - 環境変数が正しく読み込まれていることを確認

### 4.3 ローカル開発環境での環境変数設定（オプション）

1. **`.env.local` ファイルの作成**（プロジェクトルートに）:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **`.env.local` を `.gitignore` に追加**（既に追加されている場合があります）:
   ```
   .env.local
   .env*.local
   ```

3. **注意**: `.env.local` はGitにコミットしないでください

## 5. 設定の確認とテスト

### 5.1 設定の確認チェックリスト

- [ ] Supabaseプロジェクトが作成されている
- [ ] Supabaseの接続文字列を取得している
- [ ] Clerkプロジェクトが作成されている
- [ ] ClerkのAPIキー（公開キーとシークレットキー）を取得している
- [ ] ClerkのRedirect URLsが設定されている
- [ ] Vercelプロジェクトが作成されている
- [ ] Vercelの環境変数が設定されている
  - [ ] `DATABASE_URL`
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`

### 5.2 接続テスト（オプション）

1. **Supabaseへの接続テスト**:
   - Supabaseダッシュボードの「SQL Editor」で接続をテスト
   - または、ローカル環境でPrismaを使用して接続をテスト

2. **Clerkへの接続テスト**:
   - ローカル環境でアプリケーションを起動
   - ログイン機能が正常に動作することを確認

## 6. 次のステップ

外部サービスの設定が完了したら、以下のステップに進みます：

1. **データベースマイグレーションの実行**: SupabaseでPrismaマイグレーションを実行
2. **デプロイの実行**: Vercelでデプロイを実行
3. **動作確認**: デプロイ後の動作確認

詳細は `deployment-preparation-guide.md` を参照してください。

## トラブルシューティング

### よくある問題と解決方法

#### Supabase接続エラー

**問題**: データベースに接続できない

**解決方法**:
1. 接続文字列が正しいことを確認
2. パスワードが正しいことを確認
3. SSLモードが `require` になっていることを確認
4. ファイアウォール設定を確認（SupabaseのIPアドレスが許可されているか）

#### Clerk認証エラー

**問題**: 認証が動作しない

**解決方法**:
1. APIキーが正しく設定されていることを確認
2. Redirect URLsが正しく設定されていることを確認
3. テスト環境と本番環境で異なるキーを使用していることを確認

#### Vercelデプロイエラー

**問題**: デプロイが失敗する

**解決方法**:
1. 環境変数が正しく設定されていることを確認
2. ビルドログを確認してエラー内容を特定
3. ローカル環境でビルドが成功することを確認

## 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 注意事項

- すべてのAPIキーとパスワードは機密情報です。絶対に公開しないでください
- 環境変数は必ずVercelダッシュボードで設定してください（Gitにコミットしない）
- テスト環境と本番環境で異なるキーを使用してください
- 定期的にAPIキーをローテーションすることを推奨します

