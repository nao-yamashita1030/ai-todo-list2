"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTodo } from "@/app/actions/todos";
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
import type { TodoWithRelations } from "@/dal/todos";

type DeleteTodoFormProps = {
  todo: TodoWithRelations;
};

export function DeleteTodoForm({ todo }: DeleteTodoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteTodo(todo.id);

      if (result.success) {
        router.push("/todos");
        router.refresh();
      } else {
        setError(result.error || "TODOの削除に失敗しました");
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
        <Link href={`/todos/${todo.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          詳細に戻る
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
            TODO削除
          </CardTitle>
          <CardDescription>
            この操作は取り消せません。TODOと関連するすべてのデータが削除されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">削除するTODO:</p>
              <p className="text-lg">{todo.title}</p>
            </div>
            {todo.description && (
              <div>
                <p className="text-sm font-medium mb-2">説明:</p>
                <p className="text-sm text-muted-foreground">{todo.description}</p>
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
              この操作は取り消せません。TODO「{todo.title}」と関連するすべてのデータ（コメント、変更履歴など）が完全に削除されます。
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

