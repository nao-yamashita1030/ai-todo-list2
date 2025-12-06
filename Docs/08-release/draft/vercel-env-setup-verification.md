# Vercel環境変数設定確認

**作成日**: 2025年12月06日

## 現在の設定状況

### Development環境

✅ 以下の環境変数が設定されています：

- `DATABASE_URL`: 設定済み（Encrypted）
- `CLERK_SECRET_KEY`: 設定済み（Encrypted）
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: 設定済み（Encrypted）

### Preview環境

⚠️ 環境変数の設定が必要です

以下の環境変数を設定してください：

- `DATABASE_URL`: 未設定
- `CLERK_SECRET_KEY`: 未設定
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: 未設定

### Production環境

⚠️ 環境変数の設定が必要です

以下の環境変数を設定してください：

- `DATABASE_URL`: 未設定
- `CLERK_SECRET_KEY`: 未設定（Live keyを使用）
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: 未設定（Live keyを使用）

## 次のステップ

### 1. Preview環境の設定

以下のコマンドを実行して、Preview環境に環境変数を設定してください：

```bash
# DATABASE_URL
vercel env add DATABASE_URL preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of DATABASE_URL?" → [Supabaseの接続文字列]

# CLERK_SECRET_KEY
vercel env add CLERK_SECRET_KEY preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of CLERK_SECRET_KEY?" → sk_test_vOcItlYF4gBCyQXpcWqnv4ETbiXSPTJHTXL2uzd5a1

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → N
# プロンプト: "? What's the value of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?" → pk_test_ZnVua3ktbWF5Zmx5LTY2LmNsZXJrLmFjY291bnRzLmRldiQ
```

### 2. Production環境の設定

以下のコマンドを実行して、Production環境に環境変数を設定してください：

```bash
# DATABASE_URL
vercel env add DATABASE_URL production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of DATABASE_URL?" → [Supabaseの接続文字列]

# CLERK_SECRET_KEY（Live keyを使用）
vercel env add CLERK_SECRET_KEY production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → y
# プロンプト: "? What's the value of CLERK_SECRET_KEY?" → sk_live_...（Clerkダッシュボードから取得）

# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY（Live keyを使用）
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# プロンプト: "? Your value will be encrypted. Mark as sensitive? (y/N)" → N
# プロンプト: "? What's the value of NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?" → pk_live_...（Clerkダッシュボードから取得）
```

**注意**: Production環境では、ClerkのLive keyを使用する必要があります。ClerkダッシュボードからLive keyを取得してください。

## 設定完了後の確認

すべての環境変数を設定したら、以下のコマンドで確認します：

```bash
vercel env ls
```

すべての環境（Development、Preview、Production）に環境変数が設定されていることを確認してください。

## チェックリスト

- [x] Development環境の環境変数設定完了
- [ ] Preview環境の環境変数設定
- [ ] Production環境の環境変数設定
- [ ] 環境変数の設定確認（`vercel env ls`）

