import Marquee from "react-fast-marquee";
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
    <Marquee className="w-full" speed={80}>
      <div className="flex gap-10 items-center justify-center">
        {duplicatedPartners.map((partner, index) => (
          <figure key={index} className="w-50 filter">
            <img className="w-full " src={partner.logo} alt={partner.name} loading="lazy" />
          </figure>
        ))}
      </div>
    </Marquee>
  );
};

export default PartnersCarousel;