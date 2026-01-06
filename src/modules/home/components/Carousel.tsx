import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  scrollAmount?: number;
  auto?: boolean;
  autoInterval?: number;
  className?:string;
}

const Carousel= ({ 
  children, 
  scrollAmount = 300,
  auto = false,
  autoInterval = 3000,
  className
}:Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const autoScrollRef = useRef<number | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  useEffect(() => {
    if (!auto || !scrollRef.current) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          
          // Si llegamos al final, volver al inicio
          if (scrollLeft >= scrollWidth - clientWidth - 1) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
          setTimeout(checkScroll, 300);
        }
      }, autoInterval);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [auto, autoInterval, scrollAmount]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Si vamos a la derecha y llegamos al final, volver al inicio
      if (direction === 'right' && scrollLeft >= scrollWidth - clientWidth - scrollAmount) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } 
      // Si vamos a la izquierda y estamos al inicio, ir al final
      else if (direction === 'left' && scrollLeft === 0) {
        scrollRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } 
      else {
        scrollRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
      }
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-70" />
        </button>
      )}
      
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-hidden overflow-y-hidden w-full scroll-smooth"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default Carousel;

// // Componente de ejemplo Card
// interface CardData {
//   title: string;
//   description: string;
//   color: string;
// }

// const Card: React.FC<{ data: CardData }> = ({ data }) => {
//   return (
//     <div 
//       className={`${data.color} rounded-lg p-6 shadow-md flex-shrink-0`}
//       style={{ minWidth: '250px', width: '300px' }}
//     >
//       <h3 className="text-xl font-bold mb-2 text-white">{data.title}</h3>
//       <p className="text-white/90">{data.description}</p>
//     </div>
//   );
// };

// // Ejemplo de uso
// export default function App() {
//   const components: CardData[] = [
//     { title: 'Tarjeta 1', description: 'Contenido de la primera tarjeta', color: 'bg-blue-500' },
//     { title: 'Tarjeta 2', description: 'Contenido de la segunda tarjeta', color: 'bg-purple-500' },
//     { title: 'Tarjeta 3', description: 'Contenido de la tercera tarjeta', color: 'bg-pink-500' },
//     { title: 'Tarjeta 4', description: 'Contenido de la cuarta tarjeta', color: 'bg-green-500' },
//     { title: 'Tarjeta 5', description: 'Contenido de la quinta tarjeta', color: 'bg-orange-500' },
//     { title: 'Tarjeta 6', description: 'Contenido de la sexta tarjeta', color: 'bg-red-500' },
//     { title: 'Tarjeta 7', description: 'Contenido de la séptima tarjeta', color: 'bg-teal-500' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">Carrusel de Componentes</h1>
        
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">Carrusel Manual</h2>
//           <ComponentCarousel scrollAmount={320}>
//             {components.map((data, index) => (
//               <Card key={index} data={data} />
//             ))}
//           </ComponentCarousel>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">Carrusel Automático (Infinito)</h2>
//           <ComponentCarousel scrollAmount={320} auto={true} autoInterval={2500}>
//             {components.map((data, index) => (
//               <Card key={index} data={data} />
//             ))}
//           </ComponentCarousel>
//         </div>
//       </div>
//     </div>
//   );
// }