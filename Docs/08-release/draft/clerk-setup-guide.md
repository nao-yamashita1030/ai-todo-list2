# Clerk設定ガイド

**作成日**: 2025年12月06日  
**対象バージョン**: v1.0.0

## 概要

本ガイドでは、TODOリスト管理WEBアプリケーションでClerk認証を設定する手順を説明します。

## 前提条件

- Clerkアカウント（https://clerk.com）
- 既にClerkのミドルウェアが実装されている（`src/middleware.ts`）
- 既にClerkProviderが実装されている（`src/app/layout.tsx`）

## 1. Clerkアカウントの準備

### 1.1 アカウント作成（未登録の場合）

1. **Clerkにアクセス**: https://clerk.com
2. **アカウント作成**:
   - 「Sign up」をクリック
   - GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録
   - メール認証を完了

### 1.2 ログイン

1. **Clerkダッシュボードにアクセス**: https://dashboard.clerk.com
2. **既存アカウントでログイン**

## 2. 新規アプリケーションの作成

### 2.1 アプリケーション作成

1. **ダッシュボードにアクセス**: https://dashboard.clerk.com
2. **新規アプリケーションを作成**:
   - 「Create Application」ボタンをクリック
   - 以下の情報を入力:
     - **Application name**: `AI Todo List` または `ai-todo-list2`
     - **Authentication methods**: 認証方法を選択
       - ✅ **Email**: 必須（チェック）
       - ⬜ **Google**: オプション（必要に応じて）
       - ⬜ **GitHub**: オプション（必要に応じて）
       - ⬜ **その他の認証方法**: 必要に応じて選択
3. **アプリケーションの作成**:
   - 「Create Application」ボタンをクリック
   - アプリケーションが作成されます

### 2.2 アプリケーション設定の確認

作成後、以下の設定を確認・実施します：

- **Application ID**: アプリケーションIDを確認（後で使用）
- **認証方法**: Email認証が有効になっていることを確認

## 3. APIキーの取得

### 3.1 API Keysにアクセス

1. **左側メニュー**: 「API Keys」をクリック
2. **API Keysページ**: 公開キーとシークレットキーが表示されます

### 3.2 公開キー（Publishable Key）の取得

**Test key（開発・テスト環境用）**:
- **Key**: `pk_test_...` で始まるキー
- **用途**: 開発環境、プレビュー環境、テスト環境
- **コピー**: このキーをコピーして保存

**Live key（本番環境用）**:
- **Key**: `pk_live_...` で始まるキー
- **用途**: 本番環境のみ
- **コピー**: このキーをコピーして保存

**注意**: 
- 公開キーはフロントエンドで使用されるため、`NEXT_PUBLIC_` プレフィックスが付いた環境変数に設定します
- テスト環境と本番環境で異なるキーを使用します

### 3.3 シークレットキー（Secret Key）の取得

**Test key（開発・テスト環境用）**:
- **Key**: `sk_test_...` で始まるキー
- **用途**: 開発環境、プレビュー環境、テスト環境
- **コピー**: このキーをコピーして保存
- **重要**: シークレットキーは機密情報です。絶対に公開しないでください

**Live key（本番環境用）**:
- **Key**: `sk_live_...` で始まるキー
- **用途**: 本番環境のみ
- **コピー**: このキーをコピーして保存
- **重要**: シークレットキーは機密情報です。絶対に公開しないでください

## 4. 認証設定の確認と設定

### 4.1 認証方法の確認

1. **左側メニュー**: 「Authentication」→「Methods」にアクセス
2. **認証方法の確認**:
   - ✅ **Email**: 有効になっていることを確認
   - ⬜ **Google**: 必要に応じて有効化
   - ⬜ **GitHub**: 必要に応じて有効化
   - その他の認証方法も必要に応じて設定

### 4.2 Redirect URLsの設定

1. **左側メニュー**: 「Authentication」→「Redirect URLs」にアクセス
2. **Redirect URLsを追加**:

   **開発環境**:
   - URL: `http://localhost:3000`
   - 「Add URL」をクリック

   **プレビュー環境**（Vercelプロジェクト作成後に設定）:
   - URL: `https://your-preview-url.vercel.app`
   - 例: `https://ai-todo-list2-*.vercel.app`
   - 「Add URL」をクリック

   **本番環境**（Vercelプロジェクト作成後に設定）:
   - URL: `https://your-domain.vercel.app`
   - 例: `https://ai-todo-list2.vercel.app`
   - 「Add URL」をクリック

3. **設定の保存**:
   - すべてのURLを追加後、「Save」をクリック

**注意**: 
- Vercelプロジェクト作成後に、実際のURLを確認して追加してください
- ワイルドカード（`*`）を使用してプレビュー環境のURLを設定することもできます

### 4.3 その他の設定（オプション）

1. **User & Authentication → Email**:
   - メールテンプレートのカスタマイズ
   - メール送信設定

2. **User & Authentication → Sessions**:
   - セッションの有効期限設定
   - セッション管理設定

3. **User & Authentication → Multi-factor**:
   - 多要素認証の設定（オプション）

## 5. 環境変数の設定

### 5.1 ローカル開発環境（`.env.local`）

プロジェクトルートに `.env.local` ファイルを作成（既に存在する場合は更新）：

```env
# Clerk認証
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Supabase（既に設定済みの場合）
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**注意**: 
- `.env.local` はGitにコミットしないでください（`.gitignore`に追加済み）
- `pk_test_...` と `sk_test_...` を使用（開発環境）

### 5.2 Vercelでの環境変数設定

1. **Vercelダッシュボード**: プロジェクトを選択
2. **Settings → Environment Variables** にアクセス
3. **環境変数を追加**:

   **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**:
   - **Key**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Value**: 
     - Preview/Development: `pk_test_...`（Test key）
     - Production: `pk_live_...`（Live key）
   - **Environment**: 
     - ✅ Production（本番環境）: Live key
     - ✅ Preview（プレビュー環境）: Test key
     - ✅ Development（開発環境）: Test key
   - 「Save」をクリック

   **CLERK_SECRET_KEY**:
   - **Key**: `CLERK_SECRET_KEY`
   - **Value**: 
     - Preview/Development: `sk_test_...`（Test key）
     - Production: `sk_live_...`（Live key）
   - **Environment**: 
     - ✅ Production（本番環境）: Live key
     - ✅ Preview（プレビュー環境）: Test key
     - ✅ Development（開発環境）: Test key
   - 「Save」をクリック

## 6. 設定の確認

### 6.1 ローカル環境での確認

1. **環境変数の確認**:
   ```bash
   # .env.localファイルが存在することを確認
   cat .env.local
   ```

2. **アプリケーションの起動**:
   ```bash
   npm run dev
   ```

3. **動作確認**:
   - ブラウザで `http://localhost:3000` にアクセス
   - ログインボタンが表示されることを確認
   - ログイン機能が正常に動作することを確認

### 6.2 Vercel環境での確認

1. **環境変数の確認**:
   - Vercelダッシュボードで環境変数が正しく設定されていることを確認

2. **デプロイの実行**:
   - コードをプッシュすると自動的にデプロイされます
   - または、手動でデプロイを実行

3. **動作確認**:
   - デプロイ後のURLにアクセス
   - ログイン機能が正常に動作することを確認

## 7. 現在の実装状況

### 7.1 実装済みの機能

- ✅ **ミドルウェア**: `src/middleware.ts` で認証が必要なルートを保護
- ✅ **ClerkProvider**: `src/app/layout.tsx` でClerkProviderを設定
- ✅ **認証チェック**: サーバーサイドで認証状態を確認
- ✅ **公開ルート**: `/`, `/sign-in`, `/sign-up` は公開ルートとして設定

### 7.2 設定が必要な項目

- [ ] Clerkアプリケーションの作成
- [ ] APIキーの取得
- [ ] Redirect URLsの設定
- [ ] 環境変数の設定（Vercel）

## 8. トラブルシューティング

### よくある問題と解決方法

#### 認証エラーが発生する

**問題**: ログインできない、認証エラーが表示される

**解決方法**:
1. 環境変数が正しく設定されていることを確認
2. APIキーが正しいことを確認（Test keyとLive keyを混同していないか）
3. Redirect URLsが正しく設定されていることを確認
4. ブラウザのコンソールでエラーメッセージを確認

#### 環境変数が読み込まれない

**問題**: 環境変数が正しく読み込まれていない

**解決方法**:
1. `.env.local` ファイルがプロジェクトルートに存在することを確認
2. 環境変数名が正しいことを確認（`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`）
3. アプリケーションを再起動
4. Vercelの場合は、環境変数が正しい環境（Production/Preview/Development）に設定されていることを確認

#### Redirect URLエラー

**問題**: リダイレクトエラーが発生する

**解決方法**:
1. ClerkダッシュボードでRedirect URLsが正しく設定されていることを確認
2. 実際のURLと設定したURLが一致していることを確認
3. ワイルドカードを使用してプレビュー環境のURLを設定

## 9. セキュリティ注意事項

1. **シークレットキーの管理**:
   - シークレットキーは絶対に公開しないでください
   - Gitにコミットしないでください
   - Vercelの環境変数で管理してください

2. **APIキーの使い分け**:
   - テスト環境ではTest keyを使用
   - 本番環境ではLive keyを使用
   - 混同しないように注意してください

3. **Redirect URLsの設定**:
   - 信頼できるURLのみを設定してください
   - ワイルドカードを使用する場合は注意してください

## 10. 次のステップ

Clerkの設定が完了したら、以下のステップに進みます：

1. **Vercelプロジェクトの作成**: Vercelでプロジェクトを作成
2. **環境変数の設定**: Vercelで環境変数を設定
3. **デプロイの実行**: デプロイを実行して動作確認

詳細は `external-services-setup.md` を参照してください。

## 参考資料

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [外部サービス設定手順書](./external-services-setup.md)

