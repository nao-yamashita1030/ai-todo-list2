import { getCurrentUserId } from "@/lib/auth";
import { getProjectsByUserId } from "@/dal/projects";
import { redirect } from "next/navigation";
import { CreateTodoForm } from "@/components/features/todos/create-todo-form";

export default async function NewTodoPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjectsByUserId(userId);

  if (projects.length === 0) {
    redirect("/projects/new?redirect=/todos/new");
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">TODO作成</h1>
      <CreateTodoForm projects={projects} />
    </div>
  );
}

