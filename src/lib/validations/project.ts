import { z } from "zod";

// フォーム用のスキーマ
export const createProjectFormSchema = z.object({
  name: z.string().min(1, "プロジェクト名は1文字以上で入力してください").max(255, "プロジェクト名は255文字以内で入力してください"),
  description: z.string().max(10000, "説明は10000文字以内で入力してください").optional(),
});

export type CreateProjectFormInput = z.infer<typeof createProjectFormSchema>;

// Server Action用のスキーマ（フォーム用と同じ）
export const createProjectSchema = createProjectFormSchema;

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// フォーム用のスキーマ（更新用）
export const updateProjectFormSchema = z.object({
  name: z.string().min(1, "プロジェクト名は1文字以上で入力してください").max(255, "プロジェクト名は255文字以内で入力してください").optional(),
  description: z.string().max(10000, "説明は10000文字以内で入力してください").optional(),
});

export type UpdateProjectFormInput = z.infer<typeof updateProjectFormSchema>;

// Server Action用のスキーマ（更新用、フォーム用と同じ）
export const updateProjectSchema = updateProjectFormSchema;

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

