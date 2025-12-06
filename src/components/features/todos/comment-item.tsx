"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCommentFormSchema, type UpdateCommentFormInput } from "@/lib/validations/comment";
import { updateComment, deleteComment } from "@/app/actions/comments";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Trash2, X, Check } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
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
import type { Comment } from "@prisma/client";

type CommentItemProps = {
  comment: Comment & {
    user: { name: string | null; email: string };
  };
  currentUserId: string;
};

export function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateCommentFormInput>({
    resolver: zodResolver(updateCommentFormSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const canEdit = comment.userId === currentUserId;
  const canDelete = comment.userId === currentUserId;

  const onSubmit = async (data: UpdateCommentFormInput) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateComment(comment.id, data);

      if (result.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(result.error || "コメントの更新に失敗しました");
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            if (messages) {
              form.setError(field as keyof UpdateCommentFormInput, {
                type: "manual",
                message: messages[0],
              });
            }
          });
        }
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteComment(comment.id);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "コメントの削除に失敗しました");
        setShowDeleteDialog(false);
      }
    } catch (err) {
      setError("予期しないエラーが発生しました");
      console.error(err);
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border-b pb-4 last:border-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="コメントを入力..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                  setError(null);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting} size="sm">
                <Check className="mr-2 h-4 w-4" />
                {isSubmitting ? "更新中..." : "更新"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="border-b pb-4 last:border-0">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-medium">
            {comment.user.name || comment.user.email}
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            {format(new Date(comment.createdAt), "yyyy年MM月dd日 HH:mm", {
              locale: ja,
            })}
            {comment.updatedAt.getTime() !== comment.createdAt.getTime() && (
              <span className="ml-1">（編集済み）</span>
            )}
          </span>
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>コメントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。コメントが完全に削除されます。
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

