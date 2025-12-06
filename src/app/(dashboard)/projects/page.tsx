import { getCurrentUserId } from "@/lib/auth";
import { getProjectsByUserId } from "@/dal/projects";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjectsByUserId(userId);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">プロジェクト一覧</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">プロジェクトがありません</p>
            <Button asChild>
              <Link href="/projects/new">最初のプロジェクトを作成</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                  {project.ownerId === userId && (
                    <Badge variant="default">オーナー</Badge>
                  )}
                </div>
                {project.description && (
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    オーナー: {project.owner.name || project.owner.email}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>メンバー: {project._count.members}人</span>
                    <span>TODO: {project._count.todos}件</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    作成日: {format(new Date(project.createdAt), "yyyy年MM月dd日", { locale: ja })}
                  </div>
                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/todos?projectId=${project.id}`}>TODO一覧を見る</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

