import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  excerpt: string;
  badge: string;
  backgroundImage: string;
  primaryButton: string;
  secondaryButton: string;
  gradientClasses: string;
  showTagline?: boolean; // Add this line
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Caminhos da Fé",
    excerpt: "\"A jornada espiritual começa com um simples passo de fé, e cada página desta obra ilumina o caminho para uma vida mais plena e significativa.\"",
    badge: "Novo Lançamento",
    backgroundImage: "https://editoradaurel.com.br/wp-content/uploads/2025/01/bannerNovidades2025-aquietai-vos-e-saaabei-que-eu-sou-deus-upscaled-font-1024x512.png",
    primaryButton: "Comprar Agora",
    secondaryButton: "Ler Amostra",
    gradientClasses: "from-[hsl(210,22%,22%)]/80 via-[hsl(210,22%,22%)]/60 to-[hsl(25,76%,31%)]/70",
    showTagline: false // Hide tagline for first slide
  },
  {
    id: 2,
    title: "Literatura Contemporânea",
    excerpt: "\"Descubra narrativas que transformam perspectivas e conectam corações através das palavras mais tocantes da literatura moderna.\"",
    badge: "Coleção Especial",
    backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    primaryButton: "Ver Coleção",
    secondaryButton: "Oferta Especial",
    gradientClasses: "from-[hsl(25,76%,31%)]/85 via-[hsl(210,22%,22%)]/75 to-[hsl(42,68%,66%)]/60",
    showTagline: true
  },
  {
    id: 3,
    title: "Um Refrigério parar alma",
    excerpt: "\"Mergulhe em obras profundas que expandem horizontes .\"",
    badge: "Inspiração",
    backgroundImage: "https://editoradaurel.com.br/wp-content/uploads/2025/01/o-ser-e-a-existencia-40-1-1024x685.jpg",
    primaryButton: "Catálogo Acadêmico",
    secondaryButton: "Desconto Estudante",
    gradientClasses: "from-[hsl(210,22%,22%)]/90 via-[hsl(25,76%,31%)]/70 to-[hsl(210,22%,22%)]/80",
    showTagline: true
  }
];

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      previousSlide();
    }
    
    setIsAutoPlaying(true);
  };

  // Mouse handling for desktop drag
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleNavigation = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    if (direction === 'prev') {
      previousSlide();
    } else {
      nextSlide();
    }
    setTimeout(() => setIsAutoPlaying(true), 1000);
  };

  return (
    <div 
      className="relative w-full h-[60vh] max-w-[560px] max-h-[420px] mx-auto bg-white shadow-xl rounded-lg overflow-hidden carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ fontSize: '70%' }} // Reduce all font sizes by 30%
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-white/20 z-20">
        <div 
          className="h-full bg-[hsl(42,68%,66%)] transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Carousel Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        <div 
          className="flex transition-transform duration-600 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className="carousel-slide min-w-full h-full relative flex-shrink-0 flex items-center justify-center"
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradientClasses}`} />
              
              {/* Background image, scaled and centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-3/5 h-3/5 mx-auto scale-[.7] transition-all duration-300"
                  style={{
                    backgroundImage: `url(${slide.backgroundImage})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '60%',
                    height: '60%',
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center p-4">
                <div className="text-center max-w-xs animate-fade-in">
                  {/* Badge */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-[hsl(42,68%,66%)]/90 text-[hsl(210,22%,22%)] text-xs font-semibold rounded-full uppercase tracking-wider">
                      {slide.badge}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {slide.title}
                  </h1>
                  
                  {/* Excerpt (Tagline) - only if showTagline is true */}
                  {slide.showTagline !== false && (
                    <p className="text-white/90 text-base mb-3 font-inter leading-relaxed">
                      {slide.excerpt}
                    </p>
                  )}
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button className="bg-[hsl(42,68%,66%)] hover:bg-[hsl(42,68%,66%)]/90 text-[hsl(210,22%,22%)] font-semibold px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">
                      {slide.primaryButton}
                    </button>
                    <button className="border-2 border-white text-white hover:bg-white hover:text-[hsl(210,22%,22%)] font-semibold px-5 py-2 rounded-lg transition-all duration-300 text-sm">
                      {slide.secondaryButton}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white/60 hover:bg-white'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => handleNavigation('prev')}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 z-20 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={() => handleNavigation('next')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 z-20 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
