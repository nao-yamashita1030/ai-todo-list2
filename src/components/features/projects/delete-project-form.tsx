"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Project } from "@prisma/client";

type DeleteProjectFormProps = {
  project: Project;
};

export function DeleteProjectForm({ project }: DeleteProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteProject(project.id);

      if (result.success) {
        router.push("/projects");
        router.refresh();
      } else {
        setError(result.error || "プロジェクトの削除に失敗しました");
        setShowDialog(false);
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
      console.error(err);
      setShowDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          一覧に戻る
        </Link>
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            プロジェクト削除
          </CardTitle>
          <CardDescription>
            この操作は取り消せません。プロジェクトと関連するすべてのデータ（TODO、メンバー、カテゴリ、タグなど）が削除されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">削除するプロジェクト:</p>
              <p className="text-lg">{project.name}</p>
            </div>
            {project.description && (
              <div>
                <p className="text-sm font-medium mb-2">説明:</p>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。プロジェクト「{project.name}」と関連するすべてのデータ（TODO、メンバー、カテゴリ、タグなど）が完全に削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "削除中..." : "削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

