import { useState } from "react";
import { Headphones, Video, ChevronRight, Star, BookOpen } from "lucide-react";

const podcasts = [
  {
    title: "Natural Alternative to Botox",
    host: "Youth & Soul",
    youtubeId: "4x3Tk0JiiGc",
    rating: 4.9,
    plays: "12.4K",
  },
  {
    title: "Peptides",
    host: "Youth & Soul",
    youtubeId: "YdZf62h-b6w",
    rating: 4.8,
    plays: "8.7K",
  },
  {
    title: "Collagen",
    host: "Youth & Soul",
    youtubeId: "fRhy2uZef3o",
    rating: 4.7,
    plays: "6.2K",
  },
  {
    title: "DIY Devices",
    host: "Youth & Soul",
    youtubeId: "90yr64u4iWo",
    rating: 4.9,
    plays: "15.1K",
  },
];

const videoReviews = [
  {
    title: "NMN Changed My Life at 50",
    reviewer: "Michael R.",
    youtubeId: "lt8Z0fNukBw",
    views: "23K",
    rating: 5,
    product: "Advanced NMN Complex 500mg",
  },
  {
    title: "Anti-Aging Devices That Actually Work",
    reviewer: "Dr. Karam",
    youtubeId: "RQBqRApN6lI",
    views: "18K",
    rating: 5,
    product: "At-Home Beauty Devices",
  },
  {
    title: "Do Anti-Aging Supplements Really Work?",
    reviewer: "KTLA",
    youtubeId: "onkGuwyepmQ",
    views: "9.4K",
    rating: 5,
    product: "NAD+ & NMN Supplements",
  },
];

function YouTubeThumbnail({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    );
  }

  return (
    <button onClick={() => setPlaying(true)} className="block w-full h-full relative group cursor-pointer">
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center group-hover:bg-foreground/30 transition-colors">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-primary-foreground ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
    </button>
  );
}

export function PodcastSection() {
  return (
    <section className="py-6 md:py-20 bg-gradient-to-br from-accent/10 via-background to-primary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full mb-3 md:mb-4">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-xs md:text-sm font-semibold text-primary">Longevity Intelligence Hub</span>
          </div>
          <h2 className="text-xl md:text-4xl text-foreground mb-2 md:mb-3">
            Listen, Watch & Learn
          </h2>
          <p className="text-xs md:text-base text-muted-foreground max-w-xl mx-auto">
            Expert podcasts and real video reviews on longevity from experts in the field
          </p>
        </div>

        {/* Featured Podcasts - YouTube Embeds */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-2xl text-foreground flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              Featured Podcasts
            </h3>
            <button onClick={() => window.location.href = "/search"} className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {podcasts.map((podcast) => (
              <div
                key={podcast.youtubeId}
                className="snap-start shrink-0 w-[220px] md:w-full text-left bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <YouTubeThumbnail youtubeId={podcast.youtubeId} title={podcast.title} />
                </div>
                <div className="p-3 md:p-4">
                  <h4 className="font-semibold text-sm md:text-base text-foreground mb-1 line-clamp-1">{podcast.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{podcast.host}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs text-foreground">{podcast.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{podcast.plays} plays</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-2xl text-foreground flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Video Reviews
            </h3>
            <button onClick={() => window.location.href = "/search"} className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videoReviews.map((review) => (
              <div
                key={review.title}
                className="snap-start shrink-0 w-[260px] md:w-full text-left bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <YouTubeThumbnail youtubeId={review.youtubeId} title={review.title} />
                </div>
                <div className="p-3 md:p-4">
                  <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{review.title}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{review.reviewer}</p>
                  <p className="text-xs text-primary font-medium mb-2 line-clamp-1">{review.product}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
