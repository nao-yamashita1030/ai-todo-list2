import { getCurrentUserId } from "@/lib/auth";
import { getProjectById } from "@/dal/projects";
import { redirect, notFound } from "next/navigation";
import { DeleteProjectForm } from "@/components/features/projects/delete-project-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DeleteProjectPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const project = await getProjectById(id, userId);

  if (!project) {
    notFound();
  }

  // 削除権限を確認（オーナーのみ）
  if (project.ownerId !== userId) {
    redirect("/projects");
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">プロジェクト削除</h1>
      <DeleteProjectForm project={project} />
    </div>
  );
}

