import { getErrorMessage } from "../../../global/GlobalUtils";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import ProductVersionCard from "../../products/components/ProductVersionCard";
import Carousel from "../components/Carousel";
import PaymentMethodsImgsJSON from "../json/PaymentMethodsCarouselImgs.json";
import IMG1 from "../../../assets/expo/IMG-1.webp";
import IMG2 from "../../../assets/expo/IMG-2.webp";
import IMG3 from "../../../assets/expo/IMG-3.webp";
import IMG4 from "../../../assets/expo/IMG-4.webp";
import IMG5 from "../../../assets/expo/IMG-5.webp";
import IMG6 from "../../../assets/expo/IMG-6.webp";
import IMG7 from "../../../assets/expo/IMG-7.webp";
import IMG8 from "../../../assets/expo/IMG-8.webp";
import clsx from "clsx";
import HeroImg from "../../../assets/hero/HeroImg.webp"
import { useThemeStore } from "../../../layouts/states/themeStore";
import PartnersCarousel from "../components/PartnersCarousel";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import CategoriesSummary from "../components/CategoriesSummary";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaBox, FaImage, FaVideo } from "react-icons/fa6";
import { PiHandbag } from "react-icons/pi";
import { BiPackage } from "react-icons/bi";

const Home = () => {

    document.title = "Iga Productos | Inicio";

    const sampleVideos: { videoUrl: string, title: string }[] = [
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1943991622832390%2F&show_text=false&width=380&t=0",
            title: "Fabricamos cascos certificados "
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1144234144137329%2F&show_text=false&width=380&t=0",
            title: "¿Tu casco realmente te protege?"
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F852065423877990%2F&show_text=false&width=560&t=0",
            title: "Cumplimos los estandares mas altos en calidad "
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=515&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1370385861112633%2F&show_text=false&width=560&t=0",
            title: "¿Sabes que tipo de casco es el mas seguro?"
        }
    ];

    const imageGallery: { index: number, url: string, description: string }[] = [
        { index: 0, url: IMG1, description: "" },
        { index: 1, url: IMG2, description: "" },
        { index: 2, url: IMG3, description: "" },
        { index: 3, url: IMG4, description: "" },
        { index: 4, url: IMG5, description: "" },
        { index: 5, url: IMG6, description: "" },
        { index: 6, url: IMG7, description: "" },
        { index: 7, url: IMG8, description: "" },
    ];

    const { theme } = useThemeStore();
    const MAX_PRODUCTS: number = 10;

    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchAds({ limit: MAX_PRODUCTS, entity: "ads" });

    const paymentMethodsImgs = PaymentMethodsImgsJSON;


    return (
        <div>
            <div>
                <div className="md:h-150 md:flex md:gap-5 rounded-xl">
                    <figure className="w-full flex items-center justify-center md:hidden bg-base-100/20 rounded-xl shadow-lg">
                        <img src={HeroImg} alt="Hero image" className="w-70/100 h-full object-cover" />
                    </figure>
                    <div className="w-full mt-2 md:mt-0 md:w-50/100 flex flex-col justify-between">
                        <div className="flex flex-col gap-2 md:gap-5 items-center justify-center md:items-start md:justify-start text-center md:text-justify">
                            <h1 className="text-center md:text-left text-3xl lg:text-5xl xl:text-7xl text-black md:text-white ">Protección que inspira confianza</h1>
                            <h2 className="text-black md:text-white text-base md:text-xl lg:text-2xl">Cada jornada merece seguridad total.</h2>
                            <h3 className="text-black md:text-white text-sm md:text-base lg:text-xl">En IGA Productos ® encontraras articulos 100% Hechos en México que cumplen los estandares y cumplimientos normativos para cuidar tu desempeño sin comprometer tu comodidad.</h3>
                            <div className="flex gap-5">
                                <Link to={"/tienda"} className="btn btn-primary">Explorar tienda</Link>
                                <Link to={"/acerca-de-iga"} className="btn btn-soft btn-primary">Conocenos</Link>
                            </div>
                        </div>
                        <div className="mt-5 md:mt-0">
                            <h3 className="text-gray-500">Inspirando confianza en</h3>
                            <PartnersCarousel />
                        </div>
                    </div>
                    <figure className="hidden md:block w-50/100 p-5 bg-base-100/20 rounded-xl shadow-lg">
                        <img src={HeroImg} alt="Hero image" className="w-full h-full object-cover" />
                    </figure>
                </div>
                <div className="w-fit mx-auto mt-5 hidden md:block">
                    <a
                        href="#home"
                        className="flex items-center text-2xl gap-2 underline underline-offset-8 font-bold"
                        aria-label="Explorar inicio">
                        <FaArrowCircleDown className="w-20 text-primary" />Explorar inicio
                    </a>
                </div>
            </div>
            <div className="p-1 md:p-5 md:mt-20 flex flex-col gap-5 md:gap-10">
                <section id="home" className="home-section">
                    <h1>Categorias principales</h1>
                    <p className="home-section-subtitle"> <FaBox className="text-primary text-2xl" /> Desliza para conocer las categorias de articulos que tenemos para ti</p>
                    <CategoriesSummary />
                </section>
                <section className="home-section">
                    <h1>Formas de pago</h1>
                    <p className="home-section-subtitle"> <PiHandbag className="text-primary text-2xl" /> Nos ajustamos a tu comodidad</p>
                    <Marquee className="w-full" gradient={false} speed={80} direction="left">
                        <div className="flex gap-5 md:gap-15 items-center justify-center">
                            {[...paymentMethodsImgs, ...paymentMethodsImgs].map((img, index) => (
                                <figure key={index} className="w-25 md:w-60 p-5 filter">
                                    <img className="w-full object-cover" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                    <Marquee className="w-full" gradient={false} speed={80} direction="right">
                        <div className="flex gap-5 md:gap-15 items-center justify-center">
                            {[...paymentMethodsImgs, ...paymentMethodsImgs].map((img, index) => (
                                <figure key={index} className="w-25 md:w-60 p-5 filter">
                                    <img className="w-full object-cover" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                </section>
                <section className="home-section">
                    <h1>Conoce nuestra marca</h1>
                    <div className="flex flex-col gap-5 md:gap-10">
                        <div>
                            <p className="home-section-subtitle"> <FaVideo className="text-primary text-2xl" /> Desliza para ver videos que quizas te puedan interesar</p>
                            <Carousel className="hidden lg:flex gap-5 items-center mt-2 md:mt-5">
                                {sampleVideos.map((video, index) => (
                                    <div key={index} className="flex flex-col w-60 md:w-64 flex-shrink-0">
                                        <p className="text-base md:text-lg font-medium line-clamp-1 mb-2">{video.title}</p>
                                        <div className="w-full h-64 md:h-72 rounded-md overflow-hidden bg-base-300 flex items-center justify-center">
                                            <iframe
                                                src={video.videoUrl}
                                                style={{ border: 'none', overflow: 'hidden' }}
                                                scrolling="no"
                                                frameBorder="0"
                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>
                            <div className="lg:hidden flex gap-5 overflow-x-scroll">
                                {sampleVideos.map((video, index) => (
                                    <div key={index} className="flex flex-col w-60 md:w-64 flex-shrink-0">
                                        <p className="text-base md:text-lg font-medium line-clamp-1 mb-2">{video.title}</p>
                                        <div className="w-full h-64 md:h-72 rounded-md overflow-hidden bg-black flex items-center justify-center">
                                            <iframe
                                                src={video.videoUrl}
                                                style={{ border: 'none', overflow: 'hidden' }}
                                                scrolling="no"
                                                frameBorder="0"
                                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="home-section-subtitle"> <FaImage className="text-primary text-2xl" />Participaciones en exposiciones nacionales e internacionales</p>
                            <Marquee className="w-full mt-2 md:mt-0" gradient={false} speed={80}>
                                <div className="flex gap-5 md:gap-10 items-center justify-center">
                                    {[...imageGallery, ...imageGallery].map((img, index) => (
                                        <figure key={index} className="w-40 h-40 md:w-100 md:h-100 md:p-5 filter">
                                            <img className="w-full h-full object-cover object-center rounded-xl " src={img.url} alt={img.description} loading="lazy" />
                                        </figure>
                                    ))}
                                </div>
                            </Marquee>

                        </div>
                    </div>
                </section>
                <section className="home-section">
                    <h1>Productos que te pueden interesar</h1>
                    <p className="home-section-subtitle"> <BiPackage className="text-primary text-2xl" />Conoce la selección de productos que tenemos para ti</p>

                    {isLoading && !error && !data && (
                        <div className="w-full flex flex-wrap gap-10 mt-5">
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                        </div>
                    )}
                    {!isLoading && !data && error && (
                        <div className="py-5">
                            <p className="text-2xl">Ocurrio un error inesperado</p>
                            <p className="text-error py-5 text-lg">{getErrorMessage(error)}</p>
                            <button type="button" className="btn btn-primary mt-5" onClick={() => refetch()}>Reintentar?</button>
                        </div>
                    )}
                    {!isLoading && !error && data && (
                        <div className="w-full grid grid-cols-2 md:flex md:flex-wrap md:gap-10 mt-5">
                            {data.map((data, index) => (
                                <ProductVersionCard key={index} className={clsx("rounded-xl p-2", theme === "ligth" ? "bg-base-100" : "bg-transparent")} versionData={data} imageLoading="lazy" />
                            ))}
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
};

export default Home;