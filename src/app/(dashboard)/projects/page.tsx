import { getCurrentUserId } from "@/lib/auth";
import { getProjectsByUserId } from "@/dal/projects";
import { redirect } from "next/navigation";
import { ProjectListWithSearch } from "@/components/features/projects/project-list-with-search";

export default async function ProjectsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjectsByUserId(userId);

  return <ProjectListWithSearch projects={projects} userId={userId} />;
}

