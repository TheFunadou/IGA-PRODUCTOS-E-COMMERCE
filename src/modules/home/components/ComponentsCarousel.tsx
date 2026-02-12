import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface ComponentCarouselProps {
  children: React.ReactNode;
  scrollAmount?: number;
}

const ComponentCarousel: React.FC<ComponentCarouselProps> = ({ 
  children, 
  scrollAmount = 300 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollValue, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
          aria-label="Anterior"
        >
          <FaChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
      
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-hidden w-full scroll-smooth"
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg transition-all"
          aria-label="Siguiente"
        >
          <FaChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default ComponentCarousel;

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
        
//         <ComponentCarousel scrollAmount={320}>
//           {components.map((data, index) => (
//             <Card key={index} data={data} />
//           ))}
//         </ComponentCarousel>
//       </div>
//     </div>
//   );
// }