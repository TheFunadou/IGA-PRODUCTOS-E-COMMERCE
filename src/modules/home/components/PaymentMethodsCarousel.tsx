import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaymentMethodsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);

    const OXXO_LOGO: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/2560px-Oxxo_Logo.svg.png";
    const BBVA_LOGO:string ="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/BBVA_2019.svg/1280px-BBVA_2019.svg.png";
    const VISA_LOGO:string = "https://blog.logomyway.com/wp-content/uploads/2022/02/visa-logo.png";
    const MASTERCARD_LOGO:string = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Mastercard_logo.svg/1280px-Mastercard_logo.svg.png";
    const MERCADO_PAGO:string = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTALMYkCVu-ofjL4z3_-NtPFgp5Vzlh_Tv9KA&s";
    // Datos de ejemplo para los componentes
    const inputImages = [
        {
            image_url: VISA_LOGO
        },
        {
            image_url: MASTERCARD_LOGO
        },
        {
            image_url: BBVA_LOGO
        },
        {
            image_url: OXXO_LOGO
        },
        {
            image_url : MERCADO_PAGO
        }

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
        const maxIndex = inputImages.length - visibleItems;
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        const maxIndex = inputImages.length - visibleItems;
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        const maxIndex = inputImages.length - visibleItems;
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
                            className="flex transition-transform duration-500 ease-in-out gap-10"
                            style={{
                                transform: `translateX(-${currentIndex * (320 + 16)}px)`, // 320px width + 16px gap
                            }}
                        >
                            {inputImages.map((images, index) => (
                                <div key={index} className={`w-90 p-5 rounded-xl border-1 border-gray-300 flex items-center justify-center bg-white shadow-xl`}>
                                    <figure>
                                        <img src={images.image_url} alt={`Metodo de pago ${index}`} />
                                    </figure>
                                </div>
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
                {Array.from({ length: inputImages.length - visibleItems + 1 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex
                            ? 'bg-blue-500'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Ir a posición ${index + 1}`}
                    />
                ))}
            </div>

            {/* Información adicional
            <div className="text-center mt-4 text-gray-600">
                <p>Mostrando {Math.min(currentIndex + visibleItems, inputImages.length - currentIndex)} de {inputImages.length} image</p>
            </div> */}
        </div>
    );
};

export default PaymentMethodsCarousel;