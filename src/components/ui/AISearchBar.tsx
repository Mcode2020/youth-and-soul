import { useState, useEffect, useRef } from "react";
import { Search, Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const placeholders = [
  "What helps stubborn forehead lines without Botox?",
  "Best NMN for value and purity",
  "Athlete-safe supplements for recovery",
  "Longevity basics for beginners",
  "How to improve skin elasticity naturally",
];

interface AISearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export function AISearchBar({ className, onSearch }: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);

  // Fetch AI suggestions as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const { data, error } = await supabase.functions.invoke("ai-suggest", {
          body: { query: query.trim() },
        });
        if (!error && data?.suggestions) {
          setSuggestions(data.suggestions.slice(0, 5));
        }
      } catch {
        // Silently fail
      } finally {
        setLoadingSuggestions(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      // Auto-search after voice input
      onSearch?.(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const showDropdown = isFocused && (query.trim().length >= 2 || query.trim().length === 0);
  const displaySuggestions = query.trim().length >= 2 ? suggestions : [];

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full transition-all duration-300",
        className
      )}
    >
      <div 
        className={cn(
          "relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl",
          "bg-card border-2 transition-all duration-300",
          "shadow-soft hover:shadow-medium",
          isFocused 
            ? "border-primary/40 shadow-medium" 
            : "border-border/50"
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 shrink-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholders[placeholderIndex]}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/60",
            "text-sm sm:text-base font-sans focus:outline-none",
            "min-h-[36px] sm:min-h-[44px]"
          )}
        />

        {loadingSuggestions && (
          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
        )}

        <button
          type="button"
          onClick={startVoiceSearch}
          className={cn(
            "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl transition-colors shrink-0",
            isListening
              ? "bg-primary text-primary-foreground animate-pulse"
              : "bg-secondary/80 text-muted-foreground hover:bg-secondary"
          )}
          aria-label="Voice search"
        >
          <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="submit"
          className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
          aria-label="Search"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card rounded-2xl border border-border shadow-elevated animate-scale-in z-[9999]">
          {displaySuggestions.length > 0 ? (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <Search className="w-3 h-3" /> AI Suggestions
              </p>
              <div className="space-y-1">
                {displaySuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(suggestion);
                      onSearch?.(suggestion);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Try asking
              </p>
              <div className="space-y-1">
                {placeholders.slice(0, 3).map((placeholder, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(placeholder);
                      onSearch?.(placeholder);
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
