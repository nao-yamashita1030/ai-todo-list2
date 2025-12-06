# Clerk設定チェックリスト

**作成日**: 2025年12月06日

## 設定チェックリスト

### 1. Clerkアカウントの準備

- [ ] Clerkアカウントを作成（未登録の場合）
- [ ] Clerkダッシュボードにログイン

### 2. アプリケーションの作成

- [ ] 新規アプリケーションを作成
- [ ] アプリケーション名を設定（例: `AI Todo List`）
- [ ] 認証方法を選択（Email必須）
- [ ] アプリケーションIDを確認

### 3. APIキーの取得

- [ ] API Keysページにアクセス
- [ ] Test key（公開キー）を取得: `pk_test_...`
- [ ] Test key（シークレットキー）を取得: `sk_test_...`
- [ ] Live key（公開キー）を取得: `pk_live_...`（本番環境用）
- [ ] Live key（シークレットキー）を取得: `sk_live_...`（本番環境用）
- [ ] すべてのキーを安全に保存

### 4. 認証設定

- [ ] 認証方法を確認（Email認証が有効）
- [ ] Redirect URLsを設定
  - [ ] 開発環境: `http://localhost:3000`
  - [ ] プレビュー環境: `https://your-preview-url.vercel.app`（Vercel作成後）
  - [ ] 本番環境: `https://your-domain.vercel.app`（Vercel作成後）

### 5. ローカル環境変数の設定

- [ ] `.env.local` ファイルを作成
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` を設定（Test key）
- [ ] `CLERK_SECRET_KEY` を設定（Test key）
- [ ] `.env.local` が `.gitignore` に含まれていることを確認

### 6. Vercel環境変数の設定

- [ ] Vercelプロジェクトを作成（後で実施）
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` を設定
  - [ ] Preview環境: Test key
  - [ ] Development環境: Test key
  - [ ] Production環境: Live key
- [ ] `CLERK_SECRET_KEY` を設定
  - [ ] Preview環境: Test key
  - [ ] Development環境: Test key
  - [ ] Production環境: Live key

### 7. 動作確認

- [ ] ローカル環境でアプリケーションを起動
- [ ] ログインボタンが表示されることを確認
- [ ] ログイン機能が正常に動作することを確認
- [ ] ログアウト機能が正常に動作することを確認
- [ ] 認証が必要なページが保護されていることを確認

## 設定情報の記録

### APIキー（機密情報のため、このファイルには記載しない）

- Test key（公開キー）: `pk_test_...` [取得済み/未取得]
- Test key（シークレットキー）: `sk_test_...` [取得済み/未取得]
- Live key（公開キー）: `pk_live_...` [取得済み/未取得]
- Live key（シークレットキー）: `sk_live_...` [取得済み/未取得]

**注意**: これらのキーは機密情報です。このファイルには記載せず、安全に管理してください。

### アプリケーション情報

- アプリケーション名: [設定した名前]
- アプリケーションID: [Clerkダッシュボードから確認]

### Redirect URLs

- 開発環境: `http://localhost:3000` [設定済み/未設定]
- プレビュー環境: [Vercelプロジェクト作成後に設定]
- 本番環境: [Vercelプロジェクト作成後に設定]

## 次のステップ

- [ ] Vercelプロジェクトの作成
- [ ] Vercelでの環境変数設定
- [ ] デプロイの実行
- [ ] 動作確認

## 参考資料

- [Clerk設定ガイド](./clerk-setup-guide.md)
- [外部サービス設定手順書](./external-services-setup.md)

