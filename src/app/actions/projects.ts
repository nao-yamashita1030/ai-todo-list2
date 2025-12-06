"use server";

import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProjectSchema, updateProjectSchema, type CreateProjectFormInput, type UpdateProjectFormInput } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";

/**
 * プロジェクトを作成する
 */
export async function createProject(input: CreateProjectFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // バリデーション
  const validationResult = createProjectSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  try {
    // プロジェクトを作成
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });

    // 作成者をproject_membersにownerロールで追加
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: "owner",
      },
    });

    // キャッシュを無効化
    revalidatePath("/projects");
    revalidatePath("/todos");

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("プロジェクト作成エラー:", error);
    return {
      success: false,
      error: "データの保存に失敗しました",
    };
  }
}

/**
 * プロジェクトを更新する
 */
export async function updateProject(projectId: string, input: UpdateProjectFormInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のプロジェクトを取得
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId, // オーナーのみ編集可能
    },
  });

  if (!existingProject) {
    return {
      success: false,
      error: "プロジェクトが見つからないか、編集する権限がありません",
    };
  }

  // バリデーション
  const validationResult = updateProjectSchema.safeParse(input);

  if (!validationResult.success) {
    return {
      success: false,
      error: "入力データが不正です",
      details: validationResult.error.flatten().fieldErrors,
    };
  }

  const data = validationResult.data;

  try {
    // 更新するフィールドのみを準備
    const updateData: { name?: string; description?: string | null } = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.description !== undefined) {
      updateData.description = data.description || null;
    }

    // プロジェクトを更新
    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        owner: true,
      },
    });

    // キャッシュを無効化
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/edit`);

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("プロジェクト更新エラー:", error);
    return {
      success: false,
      error: "データの更新に失敗しました",
    };
  }
}

/**
 * プロジェクトを削除する
 */
export async function deleteProject(projectId: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      error: "認証が必要です",
    };
  }

  // 既存のプロジェクトを取得
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId, // オーナーのみ削除可能
    },
  });

  if (!existingProject) {
    return {
      success: false,
      error: "プロジェクトが見つからないか、削除する権限がありません",
    };
  }

  try {
    // プロジェクトを削除（CASCADEで関連データも削除される）
    await prisma.project.delete({
      where: { id: projectId },
    });

    // キャッシュを無効化
    revalidatePath("/projects");
    revalidatePath("/todos");

    return {
      success: true,
    };
  } catch (error) {
    console.error("プロジェクト削除エラー:", error);
    return {
      success: false,
      error: "データの削除に失敗しました",
    };
  }
}

