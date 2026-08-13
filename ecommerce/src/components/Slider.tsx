import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  gap?: number;
  itemsPerView?: number;
  className?: string;
}

export function Slider({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  gap = 16,
  itemsPerView = 1,
  className = '',
}: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const totalSlides = Math.ceil(children.length / itemsPerView);

  useEffect(() => {
    if (!autoPlay || isHovering) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, totalSlides, isHovering]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slider Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 flex"
              style={{
                width: '100%',
                gap: `${gap}px`,
              }}
            >
              {children.slice(
                slideIndex * itemsPerView,
                (slideIndex + 1) * itemsPerView
              ).map((child, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{
                    width: `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`,
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-zinc-800 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-zinc-800 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]'
                  : 'w-2 bg-zinc-300 hover:bg-zinc-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Carousel variant - continuous scrolling
interface CarouselProps {
  children: React.ReactNode[];
  gap?: number;
  itemWidth?: number;
  speed?: number;
  className?: string;
}

export function Carousel({
  children,
  gap = 16,
  itemWidth = 300,
  speed = 50,
  className = '',
}: CarouselProps) {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentWidth = contentRef.current?.scrollWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    if (contentWidth <= containerWidth) return;

    const animation = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev + 1;
        if (newOffset >= contentWidth / 2) {
          return 0;
        }
        return newOffset;
      });
    }, speed);

    return () => clearInterval(animation);
  }, [speed, children.length]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div
        ref={contentRef}
        className="flex"
        style={{
          transform: `translateX(-${offset}px)`,
          gap: `${gap}px`,
        }}
      >
        {/* Duplicate children for seamless loop */}
        {[...children, ...children].map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${itemWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
