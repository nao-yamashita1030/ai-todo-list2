import { getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateProjectForm } from "@/components/features/projects/create-project-form";

export default async function NewProjectPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">プロジェクト作成</h1>
      <CreateProjectForm />
    </div>
  );
}

