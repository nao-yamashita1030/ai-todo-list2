import { getCurrentUserId } from "@/lib/auth";
import { getProjectById } from "@/dal/projects";
import { redirect, notFound } from "next/navigation";
import { EditProjectForm } from "@/components/features/projects/edit-project-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const project = await getProjectById(id, userId);

  if (!project) {
    notFound();
  }

  // 編集権限を確認（オーナーのみ）
  if (project.ownerId !== userId) {
    redirect("/projects");
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">プロジェクト編集</h1>
      <EditProjectForm project={project} />
    </div>
  );
}

