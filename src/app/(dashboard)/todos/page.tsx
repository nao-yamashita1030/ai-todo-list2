import { getCurrentUserId } from "@/lib/auth";
import { getTodosByUserId } from "@/dal/todos";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function TodosPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const todos = await getTodosByUserId(userId);

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TODO一覧</h1>
        <Button asChild>
          <Link href="/todos/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {todos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">TODOがありません</p>
            <Button asChild>
              <Link href="/todos/new">最初のTODOを作成</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => (
            <Card key={todo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{todo.title}</CardTitle>
                  <Badge variant={getStatusVariant(todo.status)}>
                    {getStatusLabel(todo.status)}
                  </Badge>
                </div>
                {todo.description && (
                  <CardDescription className="line-clamp-2">
                    {todo.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">優先度:</span>
                    <Badge variant={getPriorityVariant(todo.priority)}>
                      {getPriorityLabel(todo.priority)}
                    </Badge>
                  </div>
                  {todo.dueDate && (
                    <div className="text-sm text-muted-foreground">
                      期限: {format(new Date(todo.dueDate), "yyyy年MM月dd日", { locale: ja })}
                    </div>
                  )}
                  {todo.category && (
                    <div className="text-sm text-muted-foreground">
                      カテゴリ: {todo.category.name}
                    </div>
                  )}
                  {todo.todoTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {todo.todoTags.map((todoTag) => (
                        <Badge key={todoTag.tag.id} variant="outline">
                          {todoTag.tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/todos/${todo.id}`}>詳細を見る</Link>
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

