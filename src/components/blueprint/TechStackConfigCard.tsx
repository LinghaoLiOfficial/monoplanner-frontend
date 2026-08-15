"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TechStackItem } from "@/lib/types/tech-stack";

const typeLabels: Record<TechStackItem["type"], string> = {
  framework: "框架",
  language: "语言",
  ui_library: "UI 库",
  package_manager: "包管理器",
  database: "数据库",
  orm: "ORM",
  migration_tool: "迁移工具",
  runtime: "运行时",
  build_tool: "构建工具",
};

function createTechStackItem(name: string): TechStackItem {
  return {
    name: name.trim(),
    type: "framework",
    tags: [],
    role: null,
  };
}

function appendStackItem(items: TechStackItem[], name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return items;
  }
  if (items.some((item) => item.name.toLowerCase() === normalizedName.toLowerCase())) {
    return items;
  }
  return [...items, createTechStackItem(normalizedName)];
}

function StackItemRow({
  item,
  disabled,
  onRemove,
}: {
  item: TechStackItem;
  disabled?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 px-3 py-2">
      <span className="font-medium text-foreground">{item.name}</span>
      <Badge variant="secondary">{typeLabels[item.type]}</Badge>
      {item.tags?.length ? (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      {item.role ? <span className="text-xs text-muted-foreground">{item.role}</span> : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto size-7"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`移除 ${item.name}`}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

function StackColumn({
  title,
  description,
  items,
  placeholder,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  items: TechStackItem[];
  placeholder: string;
  disabled?: boolean;
  onChange: (items: TechStackItem[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const handleAdd = () => {
    const nextItems = appendStackItem(items, draft);
    if (nextItems !== items) {
      onChange(nextItems);
    }
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <StackItemRow
              key={`${item.type}:${item.name}:${index}`}
              item={item}
              disabled={disabled}
              onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            />
          ))
        ) : (
          <div className="rounded-md border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
            保存时将使用默认技术栈。
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="icon" disabled={disabled || !draft.trim()} onClick={handleAdd}>
          <Plus className="size-4" />
          <span className="sr-only">添加技术项</span>
        </Button>
      </div>
    </div>
  );
}

export function TechStackConfigCard({
  frontendStack,
  backendStack,
  saving = false,
  error,
  onFrontendStackChange,
  onBackendStackChange,
  onSave,
}: {
  frontendStack: TechStackItem[];
  backendStack: TechStackItem[];
  saving?: boolean;
  error?: string | null;
  onFrontendStackChange: (items: TechStackItem[]) => void;
  onBackendStackChange: (items: TechStackItem[]) => void;
  onSave: () => void | Promise<void>;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <StackColumn
          title="前端技术栈"
          description="框架、语言、UI 库、包管理器等前端相关技术项。"
          items={frontendStack}
          placeholder="添加新的前端技术"
          disabled={saving}
          onChange={onFrontendStackChange}
        />
        <StackColumn
          title="后端技术栈"
          description="语言、框架、数据库、ORM、迁移工具和运行时等后端相关技术项。"
          items={backendStack}
          placeholder="添加新的后端技术"
          disabled={saving}
          onChange={onBackendStackChange}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void onSave()} disabled={saving}>
          保存配置
        </Button>
      </div>
    </div>
  );
}
