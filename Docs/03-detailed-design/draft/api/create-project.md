# API詳細仕様: プロジェクト作成

## 基本情報

- **API名**: プロジェクト作成
- **エンドポイント**: `/api/projects`
- **HTTPメソッド**: POST
- **バージョン**: v1
- **説明**: 新しいプロジェクトを作成する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: ログイン済みユーザー
- **権限**: すべてのログイン済みユーザー

## リクエスト

### リクエストヘッダー

```
Content-Type: application/json
Authorization: Bearer {token}
```

### リクエストパラメータ

#### パスパラメータ
なし

#### クエリパラメータ
なし

#### リクエストボディ

```json
{
  "name": "プロジェクト名",
  "description": "プロジェクトの説明"
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| name | string | ○ | プロジェクト名（1-255文字） |
| description | string | - | プロジェクトの説明（最大10000文字） |

### リクエスト例

```bash
curl -X POST https://api.example.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "新しいプロジェクト",
    "description": "プロジェクトの説明"
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 201

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "新しいプロジェクト",
    "description": "プロジェクトの説明",
    "owner_id": "user_123",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T10:00:00Z"
  }
}
```

| フィールド名 | 型 | 説明 |
|------------|---|------|
| id | string (uuid) | プロジェクトID |
| name | string | プロジェクト名 |
| description | string | プロジェクトの説明 |
| owner_id | string | 所有者のユーザーID |
| created_at | string (datetime) | 作成日時 |
| updated_at | string (datetime) | 更新日時 |

### エラーレスポンス

**ステータスコード**: 400 / 401 / 500

```json
{
  "error": {
    "code": "E101",
    "message": "入力データが不正です",
    "details": {
      "name": "プロジェクト名は必須です"
    }
  }
}
```

| エラーコード | ステータスコード | 説明 |
|------------|----------------|------|
| E001 | 401 | 認証が必要です |
| E101 | 400 | 入力データが不正です |
| E301 | 500 | データベースエラーが発生しました |

## バリデーション

### 入力バリデーション

- `name`: 必須、1文字以上255文字以下
- `description`: オプション、10000文字以下

### ビジネスルールバリデーション

- プロジェクト名の重複チェック（同じユーザー内で重複可能、将来的に制限する可能性あり）

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. バリデーション（Zodスキーマ）
4. 現在のユーザーIDを取得
5. プロジェクトを作成
6. 作成者をproject_membersにownerロールで追加
7. 成功レスポンスを返却

## 使用例

### 例1: 基本的なプロジェクト作成

```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '新しいプロジェクト',
    description: 'プロジェクトの説明',
  }),
});

const data = await response.json();
```

## 注意事項

- プロジェクトの作成者は自動的にオーナーとして登録される
- プロジェクト作成時にproject_membersテーブルにownerロールで追加される
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [プロジェクト更新](./update-project.md)
- [プロジェクト削除](./delete-project.md)
- [プロジェクト一覧取得](../screens/project-list.md)（Server Component）


