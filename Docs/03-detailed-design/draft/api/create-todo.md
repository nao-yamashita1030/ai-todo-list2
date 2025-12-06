# API詳細仕様: TODO作成

## 基本情報

- **API名**: TODO作成
- **エンドポイント**: `/api/todos`
- **HTTPメソッド**: POST
- **バージョン**: v1
- **説明**: 新しいTODOを作成する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: プロジェクトへのアクセス権限が必要
- **権限**: プロジェクトのメンバー（ownerまたはmember）

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
  "title": "TODOタイトル",
  "description": "TODOの説明",
  "status": "todo",
  "priority": "medium",
  "due_date": "2025-12-31",
  "project_id": "uuid",
  "category_id": "uuid",
  "tag_ids": ["uuid1", "uuid2"]
}
```

| フィールド名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| title | string | ○ | TODOタイトル（1-255文字） |
| description | string | - | TODOの説明（最大10000文字） |
| status | string | - | ステータス（todo, in_progress, done、デフォルト: todo） |
| priority | string | - | 優先度（high, medium, low、デフォルト: medium） |
| due_date | string (date) | - | 期限日（YYYY-MM-DD形式） |
| project_id | string (uuid) | ○ | プロジェクトID |
| category_id | string (uuid) | - | カテゴリID |
| tag_ids | array[string] | - | タグIDの配列 |

### リクエスト例

```bash
curl -X POST https://api.example.com/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "title": "新しいTODO",
    "description": "TODOの説明",
    "status": "todo",
    "priority": "high",
    "due_date": "2025-12-31",
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "tag_ids": ["123e4567-e89b-12d3-a456-426614174002"]
  }'
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 201

```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "新しいTODO",
    "description": "TODOの説明",
    "status": "todo",
    "priority": "high",
    "due_date": "2025-12-31",
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "created_by": "user_123",
    "created_at": "2025-12-06T10:00:00Z",
    "updated_at": "2025-12-06T10:00:00Z"
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

**ステータスコード**: 400 / 401 / 403 / 500

```json
{
  "error": {
    "code": "E101",
    "message": "入力データが不正です",
    "details": {
      "title": "タイトルは必須です"
    }
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

- `title`: 必須、1文字以上255文字以下
- `description`: オプション、10000文字以下
- `status`: 'todo', 'in_progress', 'done' のいずれか
- `priority`: 'high', 'medium', 'low' のいずれか
- `due_date`: 日付形式（YYYY-MM-DD）
- `project_id`: 必須、UUID形式
- `category_id`: UUID形式
- `tag_ids`: UUIDの配列

### ビジネスルールバリデーション

- プロジェクトへのアクセス権限があること
- カテゴリが存在し、プロジェクトに属していること
- タグが存在し、プロジェクトに属していること

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. バリデーション（Zodスキーマ）
4. プロジェクトへのアクセス権限を確認
5. TODOを作成
6. タグを関連付け（todo_tagsテーブル）
7. 変更履歴を記録（historiesテーブル）
8. 成功レスポンスを返却

## 使用例

### 例1: 基本的なTODO作成

```typescript
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '新しいTODO',
    project_id: '123e4567-e89b-12d3-a456-426614174000',
  }),
});

const data = await response.json();
```

## 注意事項

- プロジェクトへのアクセス権限がない場合は403エラーを返却
- カテゴリやタグが存在しない場合はバリデーションエラーを返却
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [TODO更新](./update-todo.md)
- [TODO削除](./delete-todo.md)
- [TODO一覧取得](../screens/todo-list.md)（Server Component）

