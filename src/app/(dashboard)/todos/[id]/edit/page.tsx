import { getCurrentUserId } from "@/lib/auth";
import { getTodoById, isProjectMember } from "@/dal/todos";
import { getProjectById } from "@/dal/projects";
import { redirect, notFound } from "next/navigation";
import { EditTodoForm } from "@/components/features/todos/edit-todo-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTodoPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const todo = await getTodoById(id, userId);

  if (!todo) {
    notFound();
  }

  // 編集権限を確認（TODOの作成者またはプロジェクトのメンバー（ownerまたはmember））
  // getTodoByIdで既にプロジェクトへのアクセス権限を確認しているため、
  // プロジェクトメンバーであることは確認済み
  const isCreator = todo.createdBy === userId;
  const isOwner = todo.project.ownerId === userId;
  
  // 作成者でもオーナーでもない場合、プロジェクトメンバーかどうかを確認
  if (!isCreator && !isOwner) {
    const isMember = await isProjectMember(todo.projectId, userId);
    if (!isMember) {
      redirect(`/todos/${id}`);
    }
  }

  // プロジェクト情報を取得（カテゴリとタグを含む）
  const project = await getProjectById(todo.projectId, userId);

  if (!project) {
    notFound();
  }

  return <EditTodoForm todo={todo} project={project} />;
}

