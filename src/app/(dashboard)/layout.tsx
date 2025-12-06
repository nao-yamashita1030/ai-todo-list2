import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // ユーザー情報をデータベースに同期（エラーが発生しても続行）
  try {
    await syncUser();
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    // エラーが発生してもレイアウトを表示できるように続行
  }

  return <>{children}</>;
}
