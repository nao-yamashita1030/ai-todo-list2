import { z } from "zod";

// フォーム用のスキーマ
export const createCommentFormSchema = z.object({
  todoId: z.string().uuid("TODO IDが不正です"),
  content: z.string().min(1, "コメント内容は1文字以上で入力してください").max(10000, "コメント内容は10000文字以内で入力してください"),
});

export type CreateCommentFormInput = z.infer<typeof createCommentFormSchema>;

// Server Action用のスキーマ（フォーム用と同じ）
export const createCommentSchema = createCommentFormSchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// フォーム用のスキーマ（更新用）
export const updateCommentFormSchema = z.object({
  content: z.string().min(1, "コメント内容は1文字以上で入力してください").max(10000, "コメント内容は10000文字以内で入力してください"),
});

export type UpdateCommentFormInput = z.infer<typeof updateCommentFormSchema>;

// Server Action用のスキーマ（更新用、フォーム用と同じ）
export const updateCommentSchema = updateCommentFormSchema;

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

