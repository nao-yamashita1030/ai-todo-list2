import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

/**
 * ユーザーがアクセス可能なプロジェクト一覧を取得
 */
export async function getProjectsByUserId(userId: string) {
  try {
    const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      owner: true,
      categories: true,
      tags: true,
      _count: {
        select: {
          todos: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("プロジェクトの取得に失敗しました");
  }
}

/**
 * プロジェクトをIDで取得
 */
export async function getProjectById(projectId: string, userId: string) {
  try {
    const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      owner: true,
      members: {
        include: {
          user: true,
        },
      },
      categories: true,
      tags: true,
      _count: {
        select: {
          todos: true,
        },
      },
    },
  });

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("プロジェクトの取得に失敗しました");
  }
}

/**
 * プロジェクトへのアクセス権限を確認
 */
export async function hasProjectAccess(projectId: string, userId: string): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
  });

  return !!project;
}

