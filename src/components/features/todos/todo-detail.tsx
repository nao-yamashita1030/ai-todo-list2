import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { TodoWithRelations } from "@/dal/todos";
import type { Comment, History } from "@prisma/client";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

type TodoDetailProps = {
  todo: TodoWithRelations & {
    comments: Array<Comment & { user: { name: string | null; email: string } }>;
    histories: Array<History & { user: { name: string | null; email: string } }>;
  };
  currentUserId: string;
};

export function TodoDetail({ todo, currentUserId }: TodoDetailProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "未着手";
      case "in_progress":
        return "進行中";
      case "done":
        return "完了";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "中";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary";
      case "in_progress":
        return "default";
      case "done":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityVariant = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "created":
        return "作成";
      case "updated":
        return "更新";
      case "deleted":
        return "削除";
      case "status_changed":
        return "ステータス変更";
      default:
        return action;
    }
  };

  // 編集権限: TODOの作成者またはプロジェクトのメンバー（ownerまたはmember）
  // getTodoByIdで既にプロジェクトへのアクセス権限を確認しているため、
  // このTODOにアクセスできる = プロジェクトメンバーである
  // したがって、プロジェクトメンバーは編集可能
  const canEdit = true; // プロジェクトメンバーは既に確認済みのため、編集可能
  // 削除権限: TODOの作成者またはプロジェクトのオーナー
  const canDelete = todo.createdBy === currentUserId || todo.project.ownerId === currentUserId;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild>
          <Link href="/todos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Link>
        </Button>
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="outline" asChild>
              <Link href={`/todos/${todo.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                編集
              </Link>
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" asChild>
              <Link href={`/todos/${todo.id}/delete`}>
                <Trash2 className="mr-2 h-4 w-4" />
                削除
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* TODO詳細情報 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{todo.title}</CardTitle>
              <Badge variant={getStatusVariant(todo.status)}>
                {getStatusLabel(todo.status)}
              </Badge>
            </div>
            {todo.description && <CardDescription>{todo.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">優先度:</span>
                <Badge variant={getPriorityVariant(todo.priority)} className="ml-2">
                  {getPriorityLabel(todo.priority)}
                </Badge>
              </div>
              {todo.dueDate && (
                <div>
                  <span className="text-sm text-muted-foreground">期限日:</span>
                  <span className="ml-2">
                    {format(new Date(todo.dueDate), "yyyy年MM月dd日", { locale: ja })}
                  </span>
                </div>
              )}
            </div>
            {todo.category && (
              <div>
                <span className="text-sm text-muted-foreground">カテゴリ:</span>
                <span className="ml-2">{todo.category.name}</span>
              </div>
            )}
            {todo.todoTags.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">タグ:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {todo.todoTags.map((todoTag) => (
                    <Badge key={todoTag.tag.id} variant="outline">
                      {todoTag.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span>作成者:</span>
                <span className="ml-2">{todo.creator.name || todo.creator.email}</span>
              </div>
              <div>
                <span>作成日時:</span>
                <span className="ml-2">
                  {format(new Date(todo.createdAt), "yyyy年MM月dd日 HH:mm", { locale: ja })}
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>更新日時:</span>
              <span className="ml-2">
                {format(new Date(todo.updatedAt), "yyyy年MM月dd日 HH:mm", { locale: ja })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* コメント一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>コメント</CardTitle>
            <CardDescription>{todo.comments.length}件のコメント</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* コメント作成フォーム */}
            <CommentForm todoId={todo.id} />

            {/* コメント一覧 */}
            {todo.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">コメントはありません</p>
            ) : (
              todo.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* 変更履歴 */}
        {todo.histories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>変更履歴</CardTitle>
              <CardDescription>{todo.histories.length}件の変更</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todo.histories.map((history) => (
                <div key={history.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">{getActionLabel(history.action)}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {history.user.name || history.user.email}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {format(new Date(history.createdAt), "yyyy年MM月dd日 HH:mm", {
                          locale: ja,
                        })}
                      </span>
                    </div>
                  </div>
                  {history.newValue && (
                    <p className="text-sm text-muted-foreground">
                      {JSON.parse(history.newValue).title || "変更されました"}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

