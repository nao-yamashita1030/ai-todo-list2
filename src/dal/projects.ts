import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";

/**
 * ユーザーがアクセス可能なプロジェクト一覧を取得
 */
export async function getProjectsByUserId(userId: string) {
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
}

/**
 * プロジェクトをIDで取得
 */
export async function getProjectById(projectId: string, userId: string) {
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

