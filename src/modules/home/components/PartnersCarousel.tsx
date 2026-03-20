import Marquee from "react-fast-marquee";
import img1 from "../../../assets/distributors/1.webp"
import img2 from "../../../assets/distributors/2.webp";
import img3 from "../../../assets/distributors/3.webp";
import img4 from "../../../assets/distributors/4.webp";
import img5 from "../../../assets/distributors/5.webp";
import img6 from "../../../assets/distributors/6.webp";
import img7 from "../../../assets/distributors/7.webp";
import img8 from "../../../assets/distributors/8.webp";

const PartnersCarousel = () => {

  const partners = [
    { id: 1, name: 'Myers', logo: img1 },
    { id: 2, name: 'Priosa', logo: img2 },
    { id: 3, name: 'Contenedores y señalamientos medina', logo: img3 },
    { id: 4, name: 'Bime', logo: img4 },
    { id: 5, name: 'Vallen', logo: img5 },
    { id: 6, name: 'SVA', logo: img6 },
    { id: 7, name: 'Ferreshop', logo: img7 },
    { id: 8, name: 'A Marine Services', logo: img8 },
  ];

  return (
    <Marquee className="w-full" speed={80} autoFill pauseOnHover>
      <div className="flex gap-5 md:gap-5 items-center pl-5">
        {partners.map((partner) => (
          <figure key={partner.id} className="w-20 h-20 border border-gray-200 rounded-xl bg-base-100 flex items-center justify-center">
            <img
              className="w-full h-full object-contain"
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </Marquee>
  );
};

export default PartnersCarousel;