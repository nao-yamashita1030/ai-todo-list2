# API詳細仕様: コメント作成

## 基本情報

- **API名**: コメント作成
- **エンドポイント**: `/api/comments`
- **HTTPメソッド**: POST
- **バージョン**: v1
- **説明**: 新しいコメントを作成する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: TODOへのアクセス権限が必要
- **権限**: TODOの作成者またはプロジェクトのメンバー（ownerまたはmember）

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
  "todo_id": "uuid",
  "content": "コメント内容"
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| todo_id | string (uuid) | ○ | TODO ID |
| content | string | ○ | コメント内容（1-10000文字） |

### リクエスト例

```bash
curl -X POST https://api.example.com/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "todo_id": "123e4567-e89b-12d3-a456-426614174000",
    "content": "コメント内容"
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 201

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "todo_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user_123",
    "content": "コメント内容",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T10:00:00Z"
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
    "code": "E101",
    "message": "入力データが不正です",
    "details": {
      "content": "コメント内容は必須です"
    }
  }
}
```

| エラーコード | ステータスコード | 説明 |
|------------|----------------|------|
| E001 | 401 | 認証が必要です |
| E002 | 403 | この操作を実行する権限がありません |
| E101 | 400 | 入力データが不正です |
| E201 | 404 | 指定されたTODOが見つかりません |
| E301 | 500 | データベースエラーが発生しました |

## バリデーション

### 入力バリデーション

- `todo_id`: 必須、UUID形式
- `content`: 必須、1文字以上10000文字以下

### ビジネスルールバリデーション

- TODOへのアクセス権限があること
- TODOが存在すること

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. バリデーション（Zodスキーマ）
4. TODOの存在確認
5. TODOへのアクセス権限を確認
6. 現在のユーザーIDを取得
7. コメントを作成
8. 成功レスポンスを返却

## 使用例

### 例1: 基本的なコメント作成

```typescript
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    todo_id: '123e4567-e89b-12d3-a456-426614174000',
    content: 'コメント内容',
  }),
});

const data = await response.json();
```

## 注意事項

- TODOへのアクセス権限がない場合は403エラーを返却
- TODOが存在しない場合は404エラーを返却
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [コメント更新](./update-comment.md)
- [コメント削除](./delete-comment.md)
- [TODO詳細取得](../screens/todo-detail.md)（Server Component）


