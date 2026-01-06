import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useThemeStore } from '../../../layouts/states/themeStore';
import clsx from 'clsx';

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
}

const InfiniteCarousel = ({
  images,
  autoPlayInterval = 3000,
  showControls = true,
  showDots = true
}: CarouselProps) => {
  const { theme } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Función para ir a la siguiente imagen
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length, isTransitioning]);

  // Función para ir a la imagen anterior
  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length, isTransitioning]);

  // Función para ir a una imagen específica
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const intervalId = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, autoPlayInterval, goToNext, images.length]);

  // Reset transition state
  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, isAutoPlaying]);

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-96 rounded-lg">
        <p className="text-gray-500 text-lg">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto rounded-xl overflow-hidden">
      {/* Contenedor principal del carrusel */}
      <div className="relative overflow-hidden">
        {/* Imágenes */}
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full flex items-center justify-center "
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full object-contain rounded-t-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/800x400/e2e8f0/64748b?text=Imagen+${index + 1}`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        {showControls && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Control de auto-play */}
        {images.length > 1 && (
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label={isAutoPlaying ? 'Pausar auto-play' : 'Iniciar auto-play'}
          >
            {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        )}
      </div>

      {/* Indicadores de puntos */}
      {showDots && images.length > 1 && (
        <div className={clsx("flex justify-center items-center py-4 bg-gray-50 space-x-2", theme === "ligth" && "bg-gray-50", theme === "dark" && "bg-slate-700")}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={clsx(`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
                } disabled:cursor-not-allowed`)}
              aria-label={`Ir a la imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Información de la imagen actual */}
      {/* <div className="px-6 py-3 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          Imagen {currentIndex + 1} de {images.length}
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          Usa las flechas del teclado para navegar • Espacio para pausar/reanudar
        </p>
      </div> */}
    </div>
  );
};

export default InfiniteCarousel;
