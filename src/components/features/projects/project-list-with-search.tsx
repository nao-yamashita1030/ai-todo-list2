"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Plus, Search } from "lucide-react";
import type { Project } from "@prisma/client";

interface ProjectWithCounts extends Project {
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    todos: number;
    members: number;
  };
}

interface ProjectListWithSearchProps {
  projects: ProjectWithCounts[];
  userId: string;
}

export function ProjectListWithSearch({ projects, userId }: ProjectListWithSearchProps) {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");

  // 検索処理
  const filteredProjects = useMemo(() => {
    if (!searchKeyword) {
      return projects;
    }

    const keyword = searchKeyword.toLowerCase();
    return projects.filter((project) => {
      const matchesName = project.name.toLowerCase().includes(keyword);
      const matchesDescription = project.description?.toLowerCase().includes(keyword) || false;
      return matchesName || matchesDescription;
    });
  }, [projects, searchKeyword]);

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

      {/* 検索エリア */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="プロジェクト名や説明を検索..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchKeyword("");
              }
            }}
            className="pl-10"
            maxLength={255}
            aria-label="プロジェクト検索"
            aria-describedby="project-search-description"
          />
          <span id="project-search-description" className="sr-only">
            プロジェクト名や説明を検索できます。最大255文字まで入力できます。Escキーで検索をクリアできます。
          </span>
        </div>
      </div>

      {/* プロジェクト一覧 */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {projects.length === 0
                ? "プロジェクトがありません"
                : "検索条件に一致するプロジェクトがありません"}
            </p>
            {projects.length === 0 && (
              <Button asChild>
                <Link href="/projects/new">最初のプロジェクトを作成</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              tabIndex={0}
              role="button"
              aria-label={`プロジェクト: ${project.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/todos?projectId=${project.id}`);
                }
              }}
              onClick={() => router.push(`/todos?projectId=${project.id}`)}
            >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                    {project.ownerId === userId && <Badge variant="default">オーナー</Badge>}
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

