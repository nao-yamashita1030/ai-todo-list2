# API詳細仕様: コメント更新

## 基本情報

- **API名**: コメント更新
- **エンドポイント**: `/api/comments/[id]`
- **HTTPメソッド**: PATCH
- **バージョン**: v1
- **説明**: 既存のコメントを更新する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: コメントへの編集権限が必要
- **権限**: コメントの作成者のみ

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
| id | string (uuid) | ○ | コメントID |

#### クエリパラメータ
なし

#### リクエストボディ

```json
{
  "content": "更新されたコメント内容"
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| content | string | ○ | コメント内容（1-10000文字） |

### リクエスト例

```bash
curl -X PATCH https://api.example.com/api/comments/123e4567-e89b-12d3-a456-426614174001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "content": "更新されたコメント内容"
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "todo_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user_123",
    "content": "更新されたコメント内容",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T11:00:00Z"
  }
}
```

| フィールド名 | 型 | 説明 |
|------------|---|------|
| id | string (uuid) | コメントID |
| todo_id | string (uuid) | TODO ID |
| user_id | string | ユーザーID |
| content | string | コメント内容 |
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
| E201 | 404 | 指定されたコメントが見つかりません |
| E301 | 500 | データベースエラーが発生しました |

## バリデーション

### 入力バリデーション

- `content`: 必須、1文字以上10000文字以下

### ビジネスルールバリデーション

- コメントへの編集権限があること（作成者のみ）
- コメントが存在すること

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. コメントの存在確認
4. コメントへの編集権限を確認（作成者のみ）
5. バリデーション（Zodスキーマ）
6. コメントを更新
7. 成功レスポンスを返却

## 使用例

### 例1: コメント更新

```typescript
const response = await fetch('/api/comments/123e4567-e89b-12d3-a456-426614174001', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: '更新されたコメント内容',
  }),
});

const data = await response.json();
```

## 注意事項

- コメントへの編集権限がない場合は403エラーを返却
- コメントが存在しない場合は404エラーを返却
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [コメント作成](./create-comment.md)
- [コメント削除](./delete-comment.md)
- [TODO詳細取得](../screens/todo-detail.md)（Server Component）

