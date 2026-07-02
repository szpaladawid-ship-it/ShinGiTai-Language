import { createFileRoute, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { UIMessage } from "ai";

import { getConversation } from "@/lib/tutor.functions";
import { TutorChatWindow } from "@/components/tutor-chat";
import { useTeacherAvatar } from "@/components/teacher-avatar-picker";

export const Route = createFileRoute("/_authenticated/teacher/$conversationId")({
  component: TeacherChatRoute,
});

function TeacherChatRoute() {
  const { conversationId } = useParams({ from: "/_authenticated/teacher/$conversationId" });
  const getFn = useServerFn(getConversation);
  const avatarVariant = useTeacherAvatar();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tutor-conversation", conversationId],
    queryFn: () => getFn({ data: { id: conversationId } }),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center text-muted-foreground">
        Lesson not found.
      </div>
    );
  }

  return (
    <TutorChatWindow
      key={conversationId}
      conversationId={conversationId}
      initialMessages={data.messages as unknown as UIMessage[]}
      title={data.conversation.title}
      languageCode={data.conversation.language_code}
      level={data.conversation.level}
      mode="teacher"
      avatarVariant={avatarVariant}
    />
  );
}
