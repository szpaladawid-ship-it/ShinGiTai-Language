import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Plays AI text-to-speech audio for short snippets (one message at a time).
 * Strips Markdown so the speaker reads natural prose.
 */
export function useSpeak() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setActiveId(null);
  }, [cleanup]);

  const speak = useCallback(
    async (id: string, text: string, voice?: string) => {
      cleanup();
      const clean = text
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/[*_`#>~|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!clean) return;

      setLoadingId(id);
      try {
        const { data } = await supabase.auth.getSession();
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session?.access_token ?? ""}`,
          },
          body: JSON.stringify({ text: clean, voice }),
        });
        if (!res.ok) throw new Error(String(res.status));

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setActiveId(null);
        setActiveId(id);
        await audio.play();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("402")) toast.error("AI credits exhausted. Please add credits.");
        else if (msg.includes("429")) toast.error("Too many requests. Please wait a moment.");
        else toast.error("Could not play audio.");
        setActiveId(null);
      } finally {
        setLoadingId(null);
      }
    },
    [cleanup],
  );

  return { speak, stop, activeId, loadingId };
}
