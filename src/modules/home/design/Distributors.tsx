import Header2 from "../../../assets/headers/HEADER2.webp";
import PartnersCarousel from "../components/PartnersCarousel";
import { MdEmail } from "react-icons/md";
import { FaHandshake } from "react-icons/fa6";
import { HomeSection, PageHero, SectionHeading, StampBadge } from "./shared";

const DISTRIBUTORS_EMAIL = "atencionacliente@igaproductos.com";

const Distributors = () => {
    document.title = "Iga Productos | Distribuidores";

    return (
        <div className="px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-24 animate-fade-in-up flex flex-col">
            <PageHero
                image={Header2}
                overlayClassName="absolute inset-0 bg-blue-950/85"
                eyebrow="Iga Productos"
                title="Distribuidores Autorizados"
                paragraphs={
                    <>
                        <p className="font-bold text-white">
                            Únete a los distribuidores autorizado de Iga
                            Productos
                        </p>
                        <p>
                            Ser distribuidor autorizado de Iga Productos te abre
                            las puertas a un mundo de oportunidades en el sector
                            de seguridad industrial.
                        </p>
                    </>
                }
            />

            <HomeSection>
                <SectionHeading
                    title="Nuestra red de socios"
                    subtitle="Conoce a los distribuidores que llevan nuestros productos por todo el país"
                    icon={FaHandshake}
                />
                <PartnersCarousel />
            </HomeSection>

            <HomeSection tinted>
                <div className="bg-blue-950 rounded-3xl px-6 sm:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md">
                    <div className="flex items-center gap-5 min-w-0">
                        <StampBadge icon={MdEmail} className="text-white" />
                        <div className="min-w-0">
                            <p className="font-black text-xl sm:text-2xl text-white leading-snug">
                                Contáctanos
                            </p>
                            <p className="text-white/70 text-sm sm:text-base mt-1 max-w-md">
                                Escríbenos para unirte a la red de distribuidores
                                autorizados de Iga Productos.
                            </p>
                            <p className="text-blue-100 font-semibold text-sm sm:text-base break-all mt-2">
                                {DISTRIBUTORS_EMAIL}
                            </p>
                        </div>
                    </div>
                    <a
                        href={`mailto:${DISTRIBUTORS_EMAIL}`}
                        className="btn btn-lg w-full sm:w-auto shrink-0 rounded-xl border-0 bg-white text-blue-950 hover:bg-blue-100 gap-2"
                    >
                        <MdEmail className="text-lg" />
                        Enviar correo
                    </a>
                </div>
            </HomeSection>
        </div>
    );
};

export default Distributors;
