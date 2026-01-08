import img1 from "../../../assets/hero/1.webp"
import img2 from "../../../assets/hero/2.webp";
import img3 from "../../../assets/hero/3.webp";
import img4 from "../../../assets/hero/4.webp";
import img5 from "../../../assets/hero/5.webp";
import img6 from "../../../assets/hero/6.webp";
import img7 from "../../../assets/hero/7.webp";
import img8 from "../../../assets/hero/8.webp";

const PartnersCarousel = () => {

  const partners = [
    { id: 1, name: 'Google', logo: img1 },
    { id: 2, name: 'Microsoft', logo: img2 },
    { id: 3, name: 'Amazon', logo: img3 },
    { id: 4, name: 'Meta', logo: img4 },
    { id: 5, name: 'Apple', logo: img5 },
    { id: 6, name: 'Netflix', logo: img6 },
    { id: 7, name: 'Netflix', logo: img7 },
    { id: 8, name: 'Netflix', logo: img8 },
  ];

  // Duplicamos el array para crear el efecto infinito
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="w-full">
      <div className="">
        <div className="relative">
          {/* Contenedor del carrusel */}
          <div className="flex overflow-hidden">
            <div className="flex animate-scroll">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0 mx-8 w-50 flex items-center justify-center duration-300"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full object-contain transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PartnersCarousel;