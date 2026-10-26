import { PlayCircle } from "lucide-react";

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      let videoId = parsed.searchParams.get("v");
      if (!videoId && parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.replace("/", "");
      }
      if (!videoId && parsed.pathname.includes("/embed/")) {
        return url;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoPlayer({ url, title }: { url?: string | null; title: string }) {
  if (!url) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-ink-950 text-ink-400">
        <PlayCircle className="h-12 w-12" />
        <p className="text-sm">لم يتم إضافة فيديو لهذه المحاضرة بعد</p>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(url);

  if (embedUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
      <video src={url} controls className="h-full w-full" title={title}>
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    </div>
  );
}
