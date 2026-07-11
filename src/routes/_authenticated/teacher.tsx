import { useState } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, GraduationCap, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { listConversations, createConversation, deleteConversation } from "@/lib/tutor.functions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/teacher")({
  component: TeacherLayout,
});

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

type Conversation = {
  id: string;
  title: string;
  language_code: string;
  level: string;
  mode: string;
  updated_at: string;
};

function TeacherLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams({ strict: false }) as { conversationId?: string };
  const activeId = params.conversationId;

  const listFn = useServerFn(listConversations);
  const createFn = useServerFn(createConversation);
  const deleteFn = useServerFn(deleteConversation);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [lang, setLang] = useState<string>("");
  const [level, setLevel] = useState<string>("A1");

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["tutor-conversations", "teacher"],
    queryFn: () => listFn({ data: { mode: "teacher" } }) as Promise<Conversation[]>,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("code, name, flag_emoji")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    if (!lang) {
      toast.error("Pick a language first");
      return;
    }
    setCreating(true);
    try {
      const row = (await createFn({
        data: { language_code: lang, level, mode: "teacher" },
      })) as Conversation;
      await queryClient.invalidateQueries({ queryKey: ["tutor-conversations", "teacher"] });
      setDialogOpen(false);
      setLang("");
      setLevel("A1");
      navigate({ to: "/teacher/$conversationId", params: { conversationId: row.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start the lesson");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFn({ data: { id } });
      await queryClient.invalidateQueries({ queryKey: ["tutor-conversations", "teacher"] });
      if (activeId === id) navigate({ to: "/teacher" });
    } catch {
      toast.error("Could not delete lesson");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "flex w-full flex-col border-r border-border bg-card/50 sm:w-72",
          activeId ? "hidden sm:flex" : "flex",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border p-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
        <div className="p-3">
          <Button className="w-full" variant="hero" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> New lesson
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {isLoading ? (
            <>
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </>
          ) : lessons && lessons.length > 0 ? (
            lessons.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors",
                  activeId === c.id ? "bg-primary/10" : "hover:bg-muted",
                )}
              >
                <Link
                  to="/teacher/$conversationId"
                  params={{ conversationId: c.id }}
                  className="flex min-w-0 flex-1 items-center gap-2.5"
                >
                  <GraduationCap
                    className={cn(
                      "h-4 w-4 shrink-0",
                      activeId === c.id ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {c.language_code} · {c.level}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label="Delete lesson"
                  onClick={() => handleDelete(c.id)}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No lessons yet. Start your first structured lesson with the AI teacher.
            </p>
          )}
        </div>
      </aside>

      <main className={cn("flex-1 overflow-hidden", activeId ? "flex" : "hidden sm:flex")}>
        <Outlet />
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New lesson</DialogTitle>
            <DialogDescription>
              Choose a language and your level. The teacher follows a structured curriculum.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Language</label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {(languages ?? []).map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.flag_emoji} {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Start lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
