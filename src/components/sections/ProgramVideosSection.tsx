import { useEffect, useState } from "react";
import { Play, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProgramVideo {
  id: string;
  title: string;
  youtube_embed_url: string;
  description: string | null;
}

export function ProgramVideosSection({ slug }: { slug: string }) {
  const [videos, setVideos] = useState<ProgramVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("program_videos")
      .select("*")
      .eq("program_slug", slug)
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        setVideos(data || []);
        setLoading(false);
      });
  }, [slug]);

  if (!loading && videos.length === 0) return null;

  return (
    <section className="py-8 md:py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Video Testimonials</h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: "none" }}
          >
            {videos.map((video) => (
              <div key={video.id} className="snap-start shrink-0 w-[85vw] md:w-full">
                <div className="aspect-video rounded-xl overflow-hidden border border-border/50 shadow-soft">
                  <iframe
                    src={video.youtube_embed_url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
                {(video.title || video.description) && (
                  <div className="mt-2 px-1">
                    <h4 className="font-semibold text-sm text-foreground">{video.title}</h4>
                    {video.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{video.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
