import { getCurrentUserId } from "@/lib/auth";
import { getTodoById } from "@/dal/todos";
import { redirect, notFound } from "next/navigation";
import { DeleteTodoForm } from "@/components/features/todos/delete-todo-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeleteTodoPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const todo = await getTodoById(id, userId);

  if (!todo) {
    notFound();
  }

  // 削除権限を確認（TODOの作成者またはプロジェクトのオーナー）
  const canDelete = todo.createdBy === userId || todo.project.ownerId === userId;

  if (!canDelete) {
    redirect(`/todos/${id}`);
  }

  return <DeleteTodoForm todo={todo} />;
}

