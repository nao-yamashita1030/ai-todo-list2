# API詳細仕様一覧

## API一覧

### TODO管理API
- [TODO作成](./create-todo.md)
- [TODO更新](./update-todo.md)
- [TODO削除](./delete-todo.md)
- [TODOステータス切り替え](./toggle-todo-status.md)

### プロジェクト管理API
- [プロジェクト作成](./create-project.md)
- [プロジェクト更新](./update-project.md)
- [プロジェクト削除](./delete-project.md)
- [プロジェクトメンバー追加](./add-project-member.md)

### コメント管理API
- [コメント作成](./create-comment.md)
- [コメント更新](./update-comment.md)
- [コメント削除](./delete-comment.md)

## 注意事項

- すべてのAPIは認証が必要です
- エラーレスポンスは統一された形式で返却されます
- バリデーションはZodスキーマを使用します
