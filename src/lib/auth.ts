import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * 現在のユーザー情報を取得し、データベースに同期する
 * ユーザーが存在しない場合は作成する
 */
export async function syncUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Clerkからユーザー情報を取得
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // データベースにユーザー情報を同期
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.lastName || clerkUser.username || null,
        updatedAt: new Date(),
      },
      create: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.lastName || clerkUser.username || null,
      },
    });

    return user;
  } catch (error) {
    console.error("Error syncing user:", error);
    // エラーが発生してもアプリケーションを続行できるようにnullを返す
    return null;
  }
}

/**
 * 現在のユーザーIDを取得する
 */
export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

