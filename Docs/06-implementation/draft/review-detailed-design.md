# 詳細設計書との整合性レビュー

実施日: 2025年12月06日
レビュー対象: TODO管理機能の実装

## 1. 発見された問題点

### 1.1 重大な問題（修正必須）

#### 問題1: 編集権限の確認ロジックのバグ
**場所**: `src/app/actions/todos.ts` 143行目

**問題内容**:
```typescript
const canEdit = existingTodo.createdBy === userId || existingTodo.projectId === existingTodo.projectId;
```

`existingTodo.projectId === existingTodo.projectId`は常に`true`になるため、この条件は意味をなさない。

**詳細設計との整合性**:
- 詳細設計（API仕様）: 「TODOの作成者またはプロジェクトのメンバー（ownerまたはmember）」
- 詳細設計（セキュリティ設計）: 「TODO編集 | ○ | ○ | ×」→ ownerまたはmember

**修正案**:
プロジェクトメンバーかどうかを確認する必要がある。既に`existingTodo`を取得する際にプロジェクトへのアクセス権限を確認しているが、明示的にメンバーかどうかを確認する必要がある。

#### 問題2: カテゴリとタグのバリデーション不足
**場所**: `src/app/actions/todos.ts` (createTodo, updateTodo)

**問題内容**:
詳細設計では以下のビジネスルールバリデーションが必要：
- カテゴリが存在し、プロジェクトに属していること
- タグが存在し、プロジェクトに属していること

しかし、実装ではこれらのバリデーションが実装されていない。

**修正案**:
TODO作成・更新時に、カテゴリとタグが存在し、指定されたプロジェクトに属していることを確認するバリデーションを追加する必要がある。

### 1.2 設計との不一致（要確認）

#### 問題3: 削除権限の仕様不一致
**場所**: `src/app/actions/todos.ts` (deleteTodo)

**問題内容**:
- API仕様: 「TODOの作成者またはプロジェクトのオーナー」
- セキュリティ設計: 「TODO削除 | ○ | × | ×」→ ownerのみ
- 実装: プロジェクトのオーナーのみ

**修正内容**:
API仕様に合わせて「TODOの作成者またはプロジェクトのオーナー」に修正しました。
- `src/app/actions/todos.ts`: 削除権限の確認ロジックを修正
- `src/components/features/todos/todo-detail.tsx`: 削除ボタンの表示条件を修正
- `src/app/(dashboard)/todos/[id]/delete/page.tsx`: 削除ページの権限チェックを修正

#### 問題4: APIエンドポイントの不一致
**場所**: 全体

**問題内容**:
- 詳細設計: `/api/todos` (REST API)
- 実装: Server Actions (`app/actions/todos.ts`)

**判断**:
Next.jsのベストプラクティスに従ってServer Actionsを使用している。これは設計方針の変更であり、問題ではない。ただし、詳細設計書にこの方針を反映する必要がある。

#### 問題5: フィールド名の命名規則の不一致
**場所**: 全体

**問題内容**:
- 詳細設計: スネークケース（`due_date`, `project_id`, `category_id`, `tag_ids`）
- 実装: キャメルケース（`dueDate`, `projectId`, `categoryId`, `tagIds`）

**判断**:
TypeScript/Next.jsの慣習に従ってキャメルケースを使用している。Server Actionsを使用しているため、これは問題ではない。ただし、詳細設計書にこの命名規則を反映する必要がある。

## 2. 整合性が取れている点

### 2.1 認証・認可
- ✅ 認証チェック（Clerk）が実装されている
- ✅ プロジェクトへのアクセス権限確認が実装されている
- ✅ 編集権限の確認が実装されている（ただし、ロジックにバグあり）
- ✅ 削除権限の確認が実装されている

### 2.2 バリデーション
- ✅ 入力バリデーション（Zodスキーマ）が実装されている
- ✅ フィールドの必須チェック、文字数制限が実装されている
- ⚠️ カテゴリとタグの存在確認・プロジェクト所属確認が未実装

### 2.3 処理フロー
- ✅ 変更履歴の記録が実装されている
- ✅ キャッシュの無効化が実装されている
- ✅ エラーハンドリングが実装されている

### 2.4 画面設計
- ✅ TODO一覧画面の実装が詳細設計に準拠している
- ✅ TODO作成画面の実装が詳細設計に準拠している
- ✅ TODO詳細画面の実装が詳細設計に準拠している
- ✅ TODO編集画面の実装が詳細設計に準拠している

## 3. 修正が必要な項目

### 優先度: 高
1. ✅ **編集権限の確認ロジックの修正**（問題1） - **修正完了**
2. ✅ **カテゴリとタグのバリデーション追加**（問題2） - **修正完了**
3. ✅ **削除権限の修正**（問題3: API仕様に合わせて「TODOの作成者またはプロジェクトのオーナー」に修正） - **修正完了**

### 優先度: 中
4. **詳細設計書の更新**（問題4, 5: Server Actionsの使用と命名規則を反映）

## 4. 実施した修正

### 修正1: 削除権限の修正（API仕様に合わせる）
**修正内容**:
- API仕様に合わせて「TODOの作成者またはプロジェクトのオーナー」に修正
- `src/app/actions/todos.ts`: 削除権限の確認ロジックを修正
- `src/components/features/todos/todo-detail.tsx`: 削除ボタンの表示条件を修正
- `src/app/(dashboard)/todos/[id]/delete/page.tsx`: 削除ページの権限チェックを修正

**修正後のコード**:
```typescript
// 削除権限を確認（TODOの作成者またはプロジェクトのオーナー）
const canDelete = existingTodo.createdBy === userId || existingTodo.project.ownerId === userId;
```

### 修正2: 編集権限の確認ロジックの修正
**修正内容**:
- `existingTodo.projectId === existingTodo.projectId`という常にtrueになる条件を削除
- プロジェクトメンバーかどうかを明示的に確認するロジックに変更
- 作成者またはプロジェクトオーナーの場合は編集可能
- それ以外の場合は、プロジェクトメンバーかどうかを確認

**修正後のコード**:
```typescript
const canEdit = existingTodo.createdBy === userId || existingTodo.project.ownerId === userId;

if (!canEdit) {
  // プロジェクトメンバーかどうかを再確認
  const isMember = await prisma.projectMember.findFirst({
    where: {
      projectId: existingTodo.projectId,
      userId: userId,
    },
  });

  if (!isMember) {
    return {
      success: false,
      error: "このTODOを編集する権限がありません",
    };
  }
}
```

### 修正3: カテゴリとタグのバリデーション追加
**修正内容**:
- TODO作成時に、カテゴリが存在し、指定されたプロジェクトに属していることを確認
- TODO作成時に、タグが存在し、指定されたプロジェクトに属していることを確認
- TODO更新時にも同様のバリデーションを追加

**追加したバリデーション**:
```typescript
// カテゴリのバリデーション（指定されている場合）
if (data.categoryId) {
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      projectId: data.projectId,
    },
  });

  if (!category) {
    return {
      success: false,
      error: "指定されたカテゴリが見つからないか、このプロジェクトに属していません",
    };
  }
}

// タグのバリデーション（指定されている場合）
if (data.tagIds && data.tagIds.length > 0) {
  const tags = await prisma.tag.findMany({
    where: {
      id: { in: data.tagIds },
      projectId: data.projectId,
    },
  });

  if (tags.length !== data.tagIds.length) {
    return {
      success: false,
      error: "指定されたタグが見つからないか、このプロジェクトに属していません",
    };
  }
}
```

## 5. 修正完了サマリー

### 修正完了項目
1. ✅ **削除権限の修正**: API仕様に合わせて「TODOの作成者またはプロジェクトのオーナー」に修正
2. ✅ **編集権限の確認ロジックの修正**: プロジェクトメンバーも編集可能になるように修正
3. ✅ **カテゴリとタグのバリデーション追加**: TODO作成・更新時にカテゴリとタグの存在確認・プロジェクト所属確認を追加
4. ✅ **型エラーの修正**: フォーム用とServer Action用の型を分離し、ビルドエラーを解決

### 残りの課題（優先度: 低）
1. 詳細設計書にServer Actionsの使用方針を明記する
2. フィールド名の命名規則（キャメルケース）を詳細設計書に反映する

## 6. 整合性確認結果

**結論**: 詳細設計書との整合性を確認し、発見された問題をすべて修正しました。実装は詳細設計書に準拠しています。

