# データベース詳細設計

## 2.1 ER図
（後で図を作成）

## 2.2 テーブル定義

### users
- **テーブル名**: users
- **説明**: ユーザー情報（Clerkで管理、必要に応じて拡張）
- **カラム**:
  - `id` (VARCHAR, PRIMARY KEY): ClerkのユーザーID
  - `email` (VARCHAR, UNIQUE, NOT NULL): メールアドレス
  - `name` (VARCHAR): 表示名
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: なし
- **インデックス**: 
  - `idx_users_email` (email)

### projects
- **テーブル名**: projects
- **説明**: プロジェクト/フォルダ情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): プロジェクトID
  - `name` (VARCHAR(255), NOT NULL): プロジェクト名
  - `description` (TEXT): 説明
  - `owner_id` (VARCHAR, NOT NULL, REFERENCES users(id)): 所有者のユーザーID
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: owner_id → users(id)
- **インデックス**: 
  - `idx_projects_owner_id` (owner_id)
  - `idx_projects_created_at` (created_at)

### project_members
- **テーブル名**: project_members
- **説明**: プロジェクトメンバー情報（共有機能用）
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): ID
  - `project_id` (UUID, NOT NULL, REFERENCES projects(id) ON DELETE CASCADE): プロジェクトID
  - `user_id` (VARCHAR, NOT NULL, REFERENCES users(id) ON DELETE CASCADE): ユーザーID
  - `role` (VARCHAR(50), NOT NULL, DEFAULT 'member'): 役割（owner, member）
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
- **主キー**: id
- **外部キー**: 
  - project_id → projects(id)
  - user_id → users(id)
- **インデックス**: 
  - `idx_project_members_project_id` (project_id)
  - `idx_project_members_user_id` (user_id)
  - `idx_project_members_unique` (project_id, user_id) UNIQUE

### categories
- **テーブル名**: categories
- **説明**: カテゴリ情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): カテゴリID
  - `name` (VARCHAR(255), NOT NULL): カテゴリ名
  - `color` (VARCHAR(7)): カラーコード（#RRGGBB形式）
  - `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE): プロジェクトID（プロジェクト固有のカテゴリの場合）
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: project_id → projects(id)
- **インデックス**: 
  - `idx_categories_project_id` (project_id)

### tags
- **テーブル名**: tags
- **説明**: タグ情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): タグID
  - `name` (VARCHAR(255), NOT NULL): タグ名
  - `color` (VARCHAR(7)): カラーコード（#RRGGBB形式）
  - `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE): プロジェクトID（プロジェクト固有のタグの場合）
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: project_id → projects(id)
- **インデックス**: 
  - `idx_tags_project_id` (project_id)
  - `idx_tags_name` (name)

### todos
- **テーブル名**: todos
- **説明**: TODO情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): TODO ID
  - `title` (VARCHAR(255), NOT NULL): タイトル
  - `description` (TEXT): 説明
  - `status` (VARCHAR(50), NOT NULL, DEFAULT 'todo'): ステータス（todo, in_progress, done）
  - `priority` (VARCHAR(50), DEFAULT 'medium'): 優先度（high, medium, low）
  - `due_date` (DATE): 期限日
  - `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE): プロジェクトID
  - `category_id` (UUID, REFERENCES categories(id) ON DELETE SET NULL): カテゴリID
  - `created_by` (VARCHAR, NOT NULL, REFERENCES users(id)): 作成者のユーザーID
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: 
  - project_id → projects(id)
  - category_id → categories(id)
  - created_by → users(id)
- **インデックス**: 
  - `idx_todos_project_id` (project_id)
  - `idx_todos_status` (status)
  - `idx_todos_priority` (priority)
  - `idx_todos_due_date` (due_date)
  - `idx_todos_created_by` (created_by)
  - `idx_todos_created_at` (created_at)

### todo_tags
- **テーブル名**: todo_tags
- **説明**: TODOとタグの関連テーブル
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): ID
  - `todo_id` (UUID, NOT NULL, REFERENCES todos(id) ON DELETE CASCADE): TODO ID
  - `tag_id` (UUID, NOT NULL, REFERENCES tags(id) ON DELETE CASCADE): タグID
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
- **主キー**: id
- **外部キー**: 
  - todo_id → todos(id)
  - tag_id → tags(id)
- **インデックス**: 
  - `idx_todo_tags_todo_id` (todo_id)
  - `idx_todo_tags_tag_id` (tag_id)
  - `idx_todo_tags_unique` (todo_id, tag_id) UNIQUE

### comments
- **テーブル名**: comments
- **説明**: コメント情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): コメントID
  - `todo_id` (UUID, NOT NULL, REFERENCES todos(id) ON DELETE CASCADE): TODO ID
  - `user_id` (VARCHAR, NOT NULL, REFERENCES users(id)): ユーザーID
  - `content` (TEXT, NOT NULL): コメント内容
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
  - `updated_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 更新日時
- **主キー**: id
- **外部キー**: 
  - todo_id → todos(id)
  - user_id → users(id)
- **インデックス**: 
  - `idx_comments_todo_id` (todo_id)
  - `idx_comments_user_id` (user_id)
  - `idx_comments_created_at` (created_at)

### histories
- **テーブル名**: histories
- **説明**: 変更履歴情報
- **カラム**:
  - `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid()): 履歴ID
  - `todo_id` (UUID, NOT NULL, REFERENCES todos(id) ON DELETE CASCADE): TODO ID
  - `user_id` (VARCHAR, NOT NULL, REFERENCES users(id)): ユーザーID
  - `action` (VARCHAR(50), NOT NULL): アクション（created, updated, deleted, status_changed）
  - `old_value` (JSONB): 変更前の値
  - `new_value` (JSONB): 変更後の値
  - `created_at` (TIMESTAMP, NOT NULL, DEFAULT NOW()): 作成日時
- **主キー**: id
- **外部キー**: 
  - todo_id → todos(id)
  - user_id → users(id)
- **インデックス**: 
  - `idx_histories_todo_id` (todo_id)
  - `idx_histories_user_id` (user_id)
  - `idx_histories_created_at` (created_at)
  - `idx_histories_action` (action)

## 2.3 インデックス設計

### 主要インデックス
- **users.email**: メールアドレスでの検索を高速化
- **projects.owner_id**: ユーザーが所有するプロジェクトの検索を高速化
- **project_members.project_id, user_id**: プロジェクトメンバーの検索を高速化
- **todos.project_id**: プロジェクト内のTODO検索を高速化
- **todos.status, priority, due_date**: フィルタリングを高速化
- **comments.todo_id**: TODOのコメント取得を高速化
- **histories.todo_id**: TODOの変更履歴取得を高速化

## 2.4 制約・トリガー

### 制約
- **project_members.role**: 'owner' または 'member' のみ許可
- **todos.status**: 'todo', 'in_progress', 'done' のみ許可
- **todos.priority**: 'high', 'medium', 'low' のみ許可
- **histories.action**: 'created', 'updated', 'deleted', 'status_changed' のみ許可

### トリガー
- **updated_at自動更新**: 各テーブルのupdated_atカラムを自動更新するトリガーを設定

## 2.5 データマイグレーション

### マイグレーション方針
- Prismaを使用してマイグレーションを管理
- マイグレーションファイルはGitで管理
- 本番環境への適用前に必ず開発環境でテスト

### バージョン管理
- Prismaのマイグレーション機能を使用
- 各マイグレーションにバージョン番号を付与
- ロールバック手順を文書化


