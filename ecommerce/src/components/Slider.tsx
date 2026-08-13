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
  arrowPosition?: 'inside' | 'outside';
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
  arrowPosition = 'inside',
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
      className={`relative group ${arrowPosition === 'outside' ? 'px-14' : ''} ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slider Container */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-700 ease-in-out"
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
            className={`
              absolute top-1/2 -translate-y-1/2 z-10
              w-12 h-12 rounded-full
              bg-white shadow-xl
              flex items-center justify-center
              text-zinc-800
              transition-all duration-300
              opacity-0 group-hover:opacity-100
              hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600
              hover:text-white hover:scale-110
              disabled:opacity-50 disabled:cursor-not-allowed
              ${arrowPosition === 'inside' ? 'left-4' : '-left-6'}
            `}
            aria-label="Previous slide"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          <button
            onClick={goToNext}
            className={`
              absolute top-1/2 -translate-y-1/2 z-10
              w-12 h-12 rounded-full
              bg-white shadow-xl
              flex items-center justify-center
              text-zinc-800
              transition-all duration-300
              opacity-0 group-hover:opacity-100
              hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600
              hover:text-white hover:scale-110
              disabled:opacity-50 disabled:cursor-not-allowed
              ${arrowPosition === 'inside' ? 'right-4' : '-right-6'}
            `}
            aria-label="Next slide"
            disabled={currentIndex === totalSlides - 1}
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-2.5 rounded-full transition-all duration-500
                ${
                  index === currentIndex
                    ? 'w-10 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-lg'
                    : 'w-2.5 bg-zinc-300 hover:bg-zinc-400 hover:w-6'
                }
              `}
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
  pauseOnHover?: boolean;
}

export function Carousel({
  children,
  gap = 16,
  itemWidth = 300,
  speed = 50,
  className = '',
  pauseOnHover = true,
}: CarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentWidth = contentRef.current?.scrollWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    if (contentWidth <= containerWidth || isPaused) return;

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
  }, [speed, children.length, isPaused]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className="flex transition-transform duration-200"
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
