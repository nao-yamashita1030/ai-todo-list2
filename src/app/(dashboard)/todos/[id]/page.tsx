import { getCurrentUserId } from "@/lib/auth";
import { getTodoById } from "@/dal/todos";
import { redirect, notFound } from "next/navigation";
import { TodoDetail } from "@/components/features/todos/todo-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TodoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const todo = await getTodoById(id, userId);

  if (!todo) {
    notFound();
  }

  return <TodoDetail todo={todo} currentUserId={userId} />;
}

