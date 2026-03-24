import { getErrorMessage } from "../../../global/GlobalUtils";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import ProductVersionCard from "../../products/components/ProductVersionCard";
import Carousel from "../components/Carousel";
import IMG1 from "../../../assets/expo/IMG-1.webp";
import IMG2 from "../../../assets/expo/IMG-2.webp";
import IMG3 from "../../../assets/expo/IMG-3.webp";
import IMG4 from "../../../assets/expo/IMG-4.webp";
import IMG5 from "../../../assets/expo/IMG-5.webp";
import IMG6 from "../../../assets/expo/IMG-6.webp";
import IMG7 from "../../../assets/expo/IMG-7.webp";
import IMG8 from "../../../assets/expo/IMG-8.webp";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import Marquee from "react-fast-marquee";
import CategoriesSummary from "../components/CategoriesSummary";
import { FaBox, FaImage, FaVideo } from "react-icons/fa6";
import { PiHandbag } from "react-icons/pi";
import { BiPackage } from "react-icons/bi";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";
import Hero from "../components/Hero";
import { paymentMethodsImages } from "../helpers";

const Home = () => {

    document.title = "Iga Productos | Fabricantes y vendedores de equipo de protección personal";
    const { theme } = useThemeStore();

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

    const MAX_PRODUCTS: number = 10;

    const {
        data: ads,
        isLoading,
        error,
        refetch
    } = useFetchProductVersionCards({
        limit: MAX_PRODUCTS,
        random: true
    });

    const SectionBar = () => {
        return (
            <div className="bg-primary px-10 py-1 w-fit rounded-xl shadow-lg"></div>
        );
    };


    return (
        <div>
            <Hero />
            <div className=" md:mt-30 space-y-5 md:space-y-10">
                <section id="home" className="home-section">
                    <SectionBar />
                    <h1 className="px-2 py-1 w-fit rounded-xl border border-base-300 bg-base-300">Categorias principales</h1>
                    <div className="bg-primary text-white w-fit px-2 rounded-xl ">
                        <p className="home-section-subtitle"> <FaBox className="text-2xl" /> Desliza para conocer las categorias de articulos que tenemos para ti</p>
                    </div>
                    <CategoriesSummary />
                </section>
                <section className="home-section">
                    <SectionBar />
                    <h1 className="px-2 py-1 w-fit rounded-xl bg-base-300 border border-base-300">Formas de pago</h1>
                    <div className="bg-primary text-white w-fit px-2 rounded-xl ">
                        <p className="home-section-subtitle"> <PiHandbag className="text-2xl" /> Nos ajustamos a tu comodidad</p>
                    </div>
                    <Marquee className="w-full" gradient={false} speed={80} direction="left">
                        <div className="flex gap-5 md:gap-15 items-center justify-center">
                            {[...paymentMethodsImages, ...paymentMethodsImages].map((img, index) => (
                                <figure key={index} className="w-25 md:w-60 p-5 filter">
                                    <img className="w-full object-cover" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                    <Marquee className="w-full" gradient={false} speed={80} direction="right">
                        <div className="flex gap-5 md:gap-15 items-center justify-center">
                            {[...paymentMethodsImages, ...paymentMethodsImages].map((img, index) => (
                                <figure key={index} className="w-25 md:w-60 p-5 filter">
                                    <img className="w-full object-cover" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                </section>
                <section className="home-section">
                    <SectionBar />
                    <h1 className="px-2 py-1 w-fit rounded-xl bg-base-300 border border-base-300">Conoce nuestra marca</h1>
                    <div className="flex flex-col gap-5 md:gap-10">
                        <div>
                            <div className="bg-primary text-white w-fit px-2 rounded-xl ">
                                <p className="home-section-subtitle"> <FaVideo className="text-2xl" /> Desliza para ver videos que quizas te puedan interesar</p>
                            </div>
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
                            <div className="bg-primary text-white w-fit px-2 rounded-xl ">
                                <p className="home-section-subtitle"> <FaImage className="text-2xl" /> Participaciones en exposiciones nacionales e internacionales</p>
                            </div>
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
                    <SectionBar />
                    <h1 className="px-2 py-1 w-fit rounded-xl bg-base-300 border border-base-300">Productos que te pueden interesar</h1>
                    <div className="bg-primary text-white w-fit px-2 rounded-xl ">
                        <p className="home-section-subtitle"> <BiPackage className="text-2xl" />Conoce la selección de productos que tenemos para ti</p>
                    </div>

                    {isLoading && !error && !ads && (
                        <div className="w-full flex flex-wrap gap-10 mt-5">
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                        </div>
                    )}
                    {!isLoading && !ads && error && (
                        <div className="py-5">
                            <p className="text-2xl">Ocurrio un error inesperado</p>
                            <p className="text-error py-5 text-lg">{getErrorMessage(error)}</p>
                            <button type="button" className="btn btn-primary mt-5" onClick={() => refetch()}>Reintentar?</button>
                        </div>
                    )}
                    {!isLoading && !error && ads && (
                        <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mt-5">
                            {ads.data.map((data, index) => (
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