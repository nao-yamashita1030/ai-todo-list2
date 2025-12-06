import { getCurrentUserId } from "@/lib/auth";
import { getTodosByUserId } from "@/dal/todos";
import { redirect } from "next/navigation";
import { TodoListWithFilters } from "@/components/features/todos/todo-list-with-filters";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const todos = await getTodosByUserId(userId, params.projectId);

  return <TodoListWithFilters todos={todos} />;
}

