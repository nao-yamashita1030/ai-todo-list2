# クラス設計

## 1.1 クラス図
（後で図を作成）

## 1.2 主要クラス設計

### Server Components（Next.js）

#### TodoListPage
- **責務**: TODO一覧画面の表示
- **属性**: 
  - `projectId`: プロジェクトID（オプション）
- **メソッド**: 
  - データ取得（Server Component）
- **関係性**: TodoServiceを使用

#### TodoDetailPage
- **責務**: TODO詳細画面の表示
- **属性**: 
  - `todoId`: TODO ID
- **メソッド**: 
  - データ取得（Server Component）
- **関係性**: TodoServiceを使用

#### ProjectListPage
- **責務**: プロジェクト一覧画面の表示
- **属性**: なし
- **メソッド**: 
  - データ取得（Server Component）
- **関係性**: ProjectServiceを使用

### Client Components（React）

#### TodoForm
- **責務**: TODO作成・編集フォームの表示と送信
- **属性**: 
  - `todo`: TODOデータ（編集時）
  - `projectId`: プロジェクトID
- **メソッド**: 
  - `handleSubmit`: フォーム送信処理
  - `handleChange`: フォーム入力変更処理
- **関係性**: Server Actionsを使用

#### TodoList
- **責務**: TODO一覧の表示
- **属性**: 
  - `todos`: TODO配列
  - `filters`: フィルタ条件
- **メソッド**: 
  - `handleFilter`: フィルタリング処理
  - `handleSearch`: 検索処理
- **関係性**: TodoItemを使用

#### TodoItem
- **責務**: 個別TODOアイテムの表示
- **属性**: 
  - `todo`: TODOデータ
- **メソッド**: 
  - `handleToggleStatus`: ステータス切り替え
  - `handleDelete`: 削除処理
- **関係性**: Server Actionsを使用

#### CommentList
- **責務**: コメント一覧の表示
- **属性**: 
  - `comments`: コメント配列
  - `todoId`: TODO ID
- **メソッド**: 
  - `handleAddComment`: コメント追加
- **関係性**: CommentForm、Server Actionsを使用

### Server Actions

#### TodoActions
- **責務**: TODO関連のサーバーアクション
- **メソッド**: 
  - `createTodo`: TODO作成
  - `updateTodo`: TODO更新
  - `deleteTodo`: TODO削除
  - `toggleTodoStatus`: TODOステータス切り替え
- **関係性**: TodoServiceを使用

#### ProjectActions
- **責務**: プロジェクト関連のサーバーアクション
- **メソッド**: 
  - `createProject`: プロジェクト作成
  - `updateProject`: プロジェクト更新
  - `deleteProject`: プロジェクト削除
  - `addProjectMember`: プロジェクトメンバー追加
  - `removeProjectMember`: プロジェクトメンバー削除
- **関係性**: ProjectServiceを使用

#### CommentActions
- **責務**: コメント関連のサーバーアクション
- **メソッド**: 
  - `createComment`: コメント作成
  - `updateComment`: コメント更新
  - `deleteComment`: コメント削除
- **関係性**: CommentServiceを使用

### Service Layer（Data Access Layer）

#### TodoService
- **責務**: TODOデータの取得・操作
- **メソッド**: 
  - `getTodos`: TODO一覧取得
  - `getTodoById`: TODO詳細取得
  - `createTodo`: TODO作成
  - `updateTodo`: TODO更新
  - `deleteTodo`: TODO削除
  - `searchTodos`: TODO検索
- **関係性**: Prisma Clientを使用

#### ProjectService
- **責務**: プロジェクトデータの取得・操作
- **メソッド**: 
  - `getProjects`: プロジェクト一覧取得
  - `getProjectById`: プロジェクト詳細取得
  - `createProject`: プロジェクト作成
  - `updateProject`: プロジェクト更新
  - `deleteProject`: プロジェクト削除
  - `getProjectMembers`: プロジェクトメンバー取得
- **関係性**: Prisma Clientを使用

#### CommentService
- **責務**: コメントデータの取得・操作
- **メソッド**: 
  - `getCommentsByTodoId`: TODOのコメント取得
  - `createComment`: コメント作成
  - `updateComment`: コメント更新
  - `deleteComment`: コメント削除
- **関係性**: Prisma Clientを使用

#### HistoryService
- **責務**: 変更履歴データの取得・操作
- **メソッド**: 
  - `getHistoriesByTodoId`: TODOの変更履歴取得
  - `createHistory`: 変更履歴作成
- **関係性**: Prisma Clientを使用

### Utility Classes

#### Validation
- **責務**: バリデーション処理
- **メソッド**: 
  - `validateTodo`: TODOデータのバリデーション
  - `validateProject`: プロジェクトデータのバリデーション
  - `validateComment`: コメントデータのバリデーション
- **関係性**: Zodスキーマを使用

#### Auth
- **責務**: 認証・認可処理
- **メソッド**: 
  - `getCurrentUser`: 現在のユーザー取得
  - `checkPermission`: 権限チェック
- **関係性**: Clerk SDKを使用

## 1.3 クラス間の関係

- **Server Components** → **Service Layer** → **Prisma Client** → **Database**
- **Client Components** → **Server Actions** → **Service Layer**
- **Server Actions** → **Validation** → **Zod**
- **Server Actions** → **Auth** → **Clerk**

## 1.4 デザインパターン

### Repository Pattern
- **使用箇所**: Service Layer
- **理由**: データアクセスロジックを分離し、テスタビリティを向上
- **実装方法**: ServiceクラスでPrisma Clientをラップ

### Server Actions Pattern
- **使用箇所**: データ変更処理
- **理由**: Next.jsのServer Actions機能を活用し、型安全なAPIを実現
- **実装方法**: Server Actionsとして実装し、Zodでバリデーション

### Component Composition Pattern
- **使用箇所**: React Components
- **理由**: コンポーネントの再利用性と保守性を向上
- **実装方法**: 小さなコンポーネントを組み合わせて大きなコンポーネントを構築

