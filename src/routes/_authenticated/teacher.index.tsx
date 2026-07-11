import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { TeacherAvatar } from "@/components/teacher-avatar";
import { TeacherAvatarPicker, useTeacherAvatar } from "@/components/teacher-avatar-picker";

export const Route = createFileRoute("/_authenticated/teacher/")({
  component: TeacherEmpty,
});

function TeacherEmpty() {
  const avatar = useTeacherAvatar();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <TeacherAvatar variant={avatar} className="mb-6 w-32" />
      <h2 className="text-2xl font-bold tracking-tight">Your AI language teacher</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        A structured teacher that explains grammar, introduces vocabulary, gives you exercises, and
        corrects your answers — just like a class at school. With voice, your teacher reads every
        lesson out loud and their mouth moves as they speak. Pick a lesson on the left or start a
        new one.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <GraduationCap className="h-4 w-4" /> Select or create a lesson to begin
        </div>
        <TeacherAvatarPicker />
      </div>
    </div>
  );
}
