import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from '../../products/components/CategoryCard';

const ComponentCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);
    
    // Datos de ejemplo para los componentes
    const categories = [
        {
            title: "Cascos",
            images: [
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/Amarillo_003.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/plagosur_fluo_amarillo_AI_02.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/plagosur_marino_AI_03.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/plagosur_blanco_AM_01-300x300.jpg"
            ],
            linkText: "Ver más cascos..."
        },
        {
            title: "Barboquejos",
            images: [
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/BARBO_SM_02-1-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/BARBO_CM_04-1-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/BARBO_4p_02-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/BARBO_CM_04-1-300x300.jpg",
            ],
            linkText: "Ver más barboquejos..."
        },
        {
            title: "Lentes",
            images: [
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_02-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_04-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/ARTICO_06-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/07/MEDICA_T_01.jpg"
            ],
            linkText: "Ver más lentes..."
        },
        {
            title: "Suspensiones",
            images: [
                "https://igaproductos.com.mx/wp-content/uploads/2024/06/INTER-002-300x300.jpg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM-3-300x300.jpeg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM-2-300x300.jpeg",
                "https://igaproductos.com.mx/wp-content/uploads/2024/06/WhatsApp-Image-2024-07-04-at-5.46.15-PM-300x300.jpeg"
            ],
            linkText: "Ver más suspensiones..."
        },
        
    ];

    // Detectar el ancho de la pantalla para calcular elementos visibles
    useEffect(() => {
        const updateVisibleItems = () => {
            const width = window.innerWidth;
            if (width >= 1200) {
                setVisibleItems(3); // 3 elementos en pantallas grandes
            } else if (width >= 800) {
                setVisibleItems(2); // 2 elementos en pantallas medianas
            } else {
                setVisibleItems(1); // 1 elemento en pantallas pequeñas
            }
        };

        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);
        return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);

    const nextSlide = () => {
        const maxIndex = categories.length - visibleItems;
        setCurrentIndex((prevIndex) => 
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        const maxIndex = categories.length - visibleItems;
        setCurrentIndex((prevIndex) => 
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        const maxIndex = categories.length - visibleItems;
        if (index <= maxIndex) {
            setCurrentIndex(index);
        }
    };

    return (
        <div className="w-full mx-auto p-4 pb-16">
            {/* Contenedor del carrusel */}
            <div className="relative overflow-hidden">
                {/* Flecha izquierda */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border opacity-80 hover:opacity-100"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                {/* Contenedor de los componentes */}
                <div className="mx-16">
                    <div className="overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out gap-4"
                            style={{
                                transform: `translateX(-${currentIndex * (320 + 16)}px)`, // 320px width + 16px gap
                            }}
                        >
                            {categories.map((category, index) => (
                                <CategoryCard
                                    key={index}
                                    title={category.title}
                                    images={category.images}
                                    linkText={category.linkText}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Flecha derecha */}
                <button 
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border opacity-80 hover:opacity-100"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* Indicadores de posición */}
            <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: categories.length - visibleItems + 1 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentIndex 
                                ? 'bg-blue-500' 
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Ir a posición ${index + 1}`}
                    />
                ))}
            </div>

            {/* Información adicional */}
            <div className="text-center mt-4 text-gray-600">
                <p>Mostrando {Math.min(currentIndex + visibleItems, categories.length - currentIndex)} de {categories.length} categorías</p>
            </div>
        </div>
    );
};

export default ComponentCarousel;