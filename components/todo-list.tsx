"use client";

import { useState } from "react";
import type {
  CategoryFilter,
  SortBy,
  TodoFilter as TodoFilterValue,
} from "@/lib/types";
import { matchesSearch, sortTodos } from "@/lib/todo-utils";
import { useTodos } from "@/hooks/use-todos";
import { Card, CardContent } from "@/components/ui/card";
import { TodoInput } from "@/components/todo-input";
import { TodoFilter } from "@/components/todo-filter";
import { TodoCategoryFilter } from "@/components/todo-category-filter";
import { TodoSort } from "@/components/todo-sort";
import { TodoSearch } from "@/components/todo-search";
import { TodoItem } from "@/components/todo-item";

export function TodoList() {
  const { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();
  const [filter, setFilter] = useState<TodoFilterValue>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [query, setQuery] = useState("");

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter(
      (todo) => categoryFilter === "all" || todo.category === categoryFilter
    )
    .filter((todo) => matchesSearch(todo, query));
  const visibleTodos = sortTodos(filteredTodos, sortBy);

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />

      <Card size="sm">
        <CardContent className="flex flex-col gap-3">
          <TodoSearch value={query} onChange={setQuery} />

          <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">
              상태
            </span>
            <TodoFilter value={filter} onChange={setFilter} />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">
              정렬
            </span>
            <TodoSort value={sortBy} onChange={setSortBy} />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">
              카테고리
            </span>
            <TodoCategoryFilter
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </div>
        </CardContent>
      </Card>

      {loaded && todos.length > 0 && (
        <p className="px-1 text-xs text-muted-foreground">
          {visibleTodos.length}개 표시 중 · 전체 {todos.length}개
        </p>
      )}

      {loaded && visibleTodos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          아직 할 일이 없습니다. 위에 입력해 추가해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
