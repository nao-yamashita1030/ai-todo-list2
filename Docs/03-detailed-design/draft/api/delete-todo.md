# API詳細仕様: TODO削除

## 基本情報

- **API名**: TODO削除
- **エンドポイント**: `/api/todos/[id]`
- **HTTPメソッド**: DELETE
- **バージョン**: v1
- **説明**: 既存のTODOを削除する

## 認証・認可

- **認証要件**: 必須
- **認可要件**: TODOへの削除権限が必要
- **権限**: TODOの作成者またはプロジェクトのオーナー

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
なし

### リクエスト例

```bash
curl -X DELETE https://api.example.com/api/todos/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer {token}"
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "data": {
    "message": "TODOが正常に削除されました",
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

| フィールド名 | 型 | 説明 |
|------------|---|------|
| message | string | 成功メッセージ |
| id | string (uuid) | 削除されたTODO ID |

### エラーレスポンス

**ステータスコード**: 401 / 403 / 404 / 500

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
| E201 | 404 | 指定されたTODOが見つかりません |
| E301 | 500 | データベースエラーが発生しました |

## バリデーション

### 入力バリデーション

- `id`: 必須、UUID形式

### ビジネスルールバリデーション

- TODOへの削除権限があること
- TODOが存在すること

## 処理フロー

1. リクエストを受信
2. 認証チェック（Clerk）
3. TODOの存在確認
4. TODOへの削除権限を確認
5. 変更前の値を取得（履歴用）
6. TODOを削除（CASCADEで関連データも削除）
   - todo_tagsテーブルの関連レコード
   - commentsテーブルの関連レコード
   - historiesテーブルの関連レコード
7. 変更履歴を記録（historiesテーブル、action: 'deleted'）
8. 成功レスポンスを返却

## 使用例

### 例1: TODO削除

```typescript
const response = await fetch('/api/todos/123e4567-e89b-12d3-a456-426614174000', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

## 注意事項

- TODOへの削除権限がない場合は403エラーを返却
- TODOが存在しない場合は404エラーを返却
- 削除は物理削除（CASCADEで関連データも削除）
- データベースエラーが発生した場合は500エラーを返却

## 関連API

- [TODO作成](./create-todo.md)
- [TODO更新](./update-todo.md)
- [TODO一覧取得](../screens/todo-list.md)（Server Component）

