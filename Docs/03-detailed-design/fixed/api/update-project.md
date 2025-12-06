# API詳細仕様: プロジェクト更新

## 基本情報

- **API名**: プロジェクト更新
- **エンドポイント**: `/api/projects/[id]`
- **HTTPメソッド**: PATCH
- **バージョン**: v1
- **説明**: 既存のプロジェクトを更新する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: プロジェクトへの編集権限が必要
- **権限**: プロジェクトのオーナーのみ

## リクエスト

### リクエストヘッダー

```
Content-Type: application/json
Authorization: Bearer {token}
```

### リクエストパラメータ

#### パスパラメータ

| パラメータ名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| id | string (uuid) | ○ | プロジェクトID |

#### クエリパラメータ
なし

#### リクエストボディ

```json
{
  "name": "更新されたプロジェクト名",
  "description": "更新されたプロジェクトの説明"
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| name | string | - | プロジェクト名（1-255文字） |
| description | string | - | プロジェクトの説明（最大10000文字） |

### リクエスト例

```bash
curl -X PATCH https://api.example.com/api/projects/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "更新されたプロジェクト",
    "description": "更新された説明"
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "更新されたプロジェクト",
    "description": "更新された説明",
    "owner_id": "user_123",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T11:00:00Z"
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

**ステータスコード**: 400 / 401 / 403 / 404 / 500

```json
{
  "error": {
    "code": "E002",
    "message": "この操作を実行する権限がありません",
    "details": {}
  }
}
```

| エラーコード | ステータスコード | 説明 |
|------------|----------------|------|
| E001 | 401 | 認証が必要です |
| E002 | 403 | この操作を実行する権限がありません |
| E101 | 400 | 入力データが不正です |
| E201 | 404 | 指定されたプロジェクトが見つかりません |
| E301 | 500 | データベースエラーが発生しました |

## バリデーション

### 入力バリデーション

- `name`: 1文字以上255文字以下（指定された場合）
- `description`: 10000文字以下（指定された場合）

### ビジネスルールバリデーション

- プロジェクトへの編集権限があること（オーナーのみ）
- プロジェクトが存在すること

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. プロジェクトの存在確認
4. プロジェクトへの編集権限を確認（オーナーのみ）
5. バリデーション（Zodスキーマ）
6. プロジェクトを更新
7. 成功レスポンスを返却

## 使用例

### 例1: プロジェクト名の更新

```typescript
const response = await fetch('/api/projects/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '更新されたプロジェクト',
  }),
});

const data = await response.json();
```

### 例2: すべてのフィールドの更新

```typescript
const response = await fetch('/api/projects/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '更新されたプロジェクト',
    description: '更新された説明',
  }),
});

const data = await response.json();
```

## 注意事項

- 更新するフィールドのみをリクエストボディに含める（部分更新）
- プロジェクトへの編集権限がない場合は403エラーを返却
- プロジェクトが存在しない場合は404エラーを返却
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [プロジェクト作成](./create-project.md)
- [プロジェクト削除](./delete-project.md)
- [プロジェクト一覧取得](../screens/project-list.md)（Server Component）

