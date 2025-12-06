# API詳細仕様: TODO更新

## 基本情報

- **API名**: TODO更新
- **エンドポイント**: `/api/todos/[id]`
- **HTTPメソッド**: PATCH
- **バージョン**: v1
- **説明**: 既存のTODOを更新する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: TODOへの編集権限が必要
- **権限**: TODOの作成者またはプロジェクトのメンバー（ownerまたはmember）

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
| id | string (uuid) | ○ | TODO ID |

#### クエリパラメータ
なし

#### リクエストボディ

```json
{
  "title": "更新されたTODOタイトル",
  "description": "更新されたTODOの説明",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2025-12-31",
  "category_id": "uuid",
  "tag_ids": ["uuid1", "uuid2"]
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| title | string | - | TODOタイトル（1-255文字） |
| description | string | - | TODOの説明（最大10000文字） |
| status | string | - | ステータス（todo, in_progress, done） |
| priority | string | - | 優先度（high, medium, low） |
| due_date | string (date) | - | 期限日（YYYY-MM-DD形式） |
| category_id | string (uuid) | - | カテゴリID |
| tag_ids | array[string] | - | タグIDの配列 |

### リクエスト例

```bash
curl -X PATCH https://api.example.com/api/todos/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "更新されたTODO",
    "status": "in_progress",
    "priority": "high"
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "更新されたTODO",
    "description": "更新されたTODOの説明",
    "status": "in_progress",
    "priority": "high",
    "due_date": "2025-12-31",
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "created_by": "user_123",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T11:00:00Z"
  }
}
```

| フィールド名 | 型 | 説明 |
|------------|---|------|
| id | string (uuid) | TODO ID |
| title | string | TODOタイトル |
| description | string | TODOの説明 |
| status | string | ステータス |
| priority | string | 優先度 |
| due_date | string (date) | 期限日 |
| project_id | string (uuid) | プロジェクトID |
| category_id | string (uuid) | カテゴリID |
| created_by | string | 作成者のユーザーID |
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
      "title": "タイトルは1文字以上255文字以下で入力してください"
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

- `title`: 1文字以上255文字以下（指定された場合）
- `description`: 10000文字以下（指定された場合）
- `status`: 'todo', 'in_progress', 'done' のいずれか（指定された場合）
- `priority`: 'high', 'medium', 'low' のいずれか（指定された場合）
- `due_date`: 日付形式（YYYY-MM-DD）（指定された場合）
- `category_id`: UUID形式（指定された場合）
- `tag_ids`: UUIDの配列（指定された場合）

### ビジネスルールバリデーション

- TODOへの編集権限があること
- TODOが存在すること
- カテゴリが存在し、プロジェクトに属していること（指定された場合）
- タグが存在し、プロジェクトに属していること（指定された場合）

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. TODOの存在確認
4. TODOへの編集権限を確認
5. バリデーション（Zodスキーマ）
6. 変更前の値を取得（履歴用）
7. TODOを更新
8. タグの関連付けを更新（todo_tagsテーブル）
9. 変更履歴を記録（historiesテーブル、action: 'updated'）
10. 成功レスポンスを返却

## 使用例

### 例1: タイトルとステータスの更新

```typescript
const response = await fetch('/api/todos/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '更新されたTODO',
    status: 'in_progress',
  }),
});

const data = await response.json();
```

### 例2: すべてのフィールドの更新

```typescript
const response = await fetch('/api/todos/123e4567-e89b-12d3-a456-426614174000', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '更新されたTODO',
    description: '更新された説明',
    status: 'done',
    priority: 'high',
    due_date: '2025-12-31',
    category_id: '123e4567-e89b-12d3-a456-426614174001',
    tag_ids: ['123e4567-e89b-12d3-a456-426614174002'],
  }),
});

const data = await response.json();
```

## 注意事項

- 更新するフィールドのみをリクエストボディに含める（部分更新）
- TODOへの編集権限がない場合は403エラーを返却
- TODOが存在しない場合は404エラーを返却
- カテゴリやタグが存在しない場合はバリデーションエラーを返却
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [TODO作成](./create-todo.md)
- [TODO削除](./delete-todo.md)
- [TODO一覧取得](../screens/todo-list.md)（Server Component）


