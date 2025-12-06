import { z } from "zod";

// フォーム用のスキーマ（dueDateは文字列、default値なし）
export const createTodoFormSchema = z.object({
  title: z.string().min(1, "タイトルは1文字以上で入力してください").max(255, "タイトルは255文字以内で入力してください"),
  description: z.string().max(10000, "説明は10000文字以内で入力してください").optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["high", "medium", "low"]),
  dueDate: z.string().optional(),
  projectId: z.string().uuid("プロジェクトIDが不正です"),
  categoryId: z.string().uuid("カテゴリIDが不正です").optional(),
  tagIds: z.array(z.string().uuid("タグIDが不正です")).optional(),
});

// Server Action用のスキーマ（dueDateをDateに変換、default値を追加）
export const createTodoSchema = z.object({
  title: z.string().min(1, "タイトルは1文字以上で入力してください").max(255, "タイトルは255文字以内で入力してください"),
  description: z.string().max(10000, "説明は10000文字以内で入力してください").optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  dueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  projectId: z.string().uuid("プロジェクトIDが不正です"),
  categoryId: z.string().uuid("カテゴリIDが不正です").optional(),
  tagIds: z.array(z.string().uuid("タグIDが不正です")).optional(),
});

export type CreateTodoFormInput = z.infer<typeof createTodoFormSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

// フォーム用のスキーマ（dueDateは文字列）
export const updateTodoFormSchema = z.object({
  title: z.string().min(1, "タイトルは1文字以上で入力してください").max(255, "タイトルは255文字以内で入力してください").optional(),
  description: z.string().max(10000, "説明は10000文字以内で入力してください").optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  dueDate: z.string().optional(),
  categoryId: z.string().uuid("カテゴリIDが不正です").optional().nullable(),
  tagIds: z.array(z.string().uuid("タグIDが不正です")).optional(),
});

// Server Action用のスキーマ（dueDateをDateに変換）
export const updateTodoSchema = updateTodoFormSchema.extend({
  dueDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
});

export type UpdateTodoFormInput = z.infer<typeof updateTodoFormSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

