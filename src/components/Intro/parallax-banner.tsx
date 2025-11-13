"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ParallaxBannerProps {
  image: string;
  category: string;
  title: string;
  link: string;
}

export default function ParallaxBanner({ image, category, title, link }: ParallaxBannerProps) {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate parallax effect - image moves slower than scroll
        // Only apply when section is in viewport
        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          // More obvious parallax: calculate based on scroll position
          // When scrolling down, image moves up (positive translateY)
          const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
          // Increased multiplier for very noticeable effect
          const parallaxOffset = scrollProgress * 80; // Higher value = more obvious movement
          setScrollY(parallaxOffset);
        } else if (sectionTop >= windowHeight) {
          // Section hasn't entered viewport yet
          setScrollY(0);
        } else {
          // Section has scrolled past
          setScrollY(80);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="w-full relative overflow-hidden h-[400px] md:h-[450px]">
      <div 
        className="absolute w-full left-0" 
        style={{ 
          height: 'calc(100% + 200px)',
          top: '-100px',
          willChange: 'transform'
        }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          style={{ 
            transform: `translateY(${scrollY}px) scale(1.3)`,
            transformOrigin: 'center center',
            minHeight: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6 w-full">
          <div className="grid md:grid-cols-2 items-center">
            {/* Left side - image background */}
            <div></div>
            
            {/* Right side - text content */}
            <div className="flex flex-col items-start justify-center space-y-4 md:space-y-5 text-white z-50">
              <div className="text-xs md:text-sm font-medium tracking-wider uppercase">
                {category}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
                  {title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < title.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h2>
              </div>
              <Link
                href={link}
                className="bg-white text-black px-6 py-2 md:px-8 md:py-3 font-normal hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                DISCOVER
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

