import { useEffect, useRef, useState } from "react";

export default function PosterRow({ title, items, renderItem }) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateProgress = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (maxScroll <= 0) {
        setShowBar(false);
        return;
      }

      setShowBar(true);
      setProgress((el.scrollLeft / maxScroll) * 100);
    };

    updateProgress();
    el.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [items]);

  return (
    <div className="mb-14">
      {/* Section title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold tracking-wide text-white">
          {title}
        </h3>
        {items?.length > 0 && (
          <span className="text-sm text-gray-400">
            {items.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {!items || items.length === 0 ? (
        <div className="h-40 flex items-center justify-center rounded-lg bg-zinc-900/60 border border-zinc-800">
          <p className="text-gray-400 text-sm">Nothing here yet</p>
        </div>
      ) : (
        <>
          <div className="relative">
            

            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {/* Scroll row */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            >
              {items.map(renderItem)}
            </div>
          </div>

          {/* Scroll indicator */}
          {showBar && (
            <div className="mt-2 h-[2px] bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-white transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}