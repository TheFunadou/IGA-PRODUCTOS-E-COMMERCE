import { getErrorMessage } from "../../../global/GlobalUtils";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
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
import { FaBox, FaImage, FaVideo, FaTriangleExclamation } from "react-icons/fa6";
import { PiHandbag } from "react-icons/pi";
import { BiPackage } from "react-icons/bi";
import type { ElementType } from "react";
import { useFetchProductVersionCardsV2 } from "../../products/hooks/useFetchProductVersionCards";
import Hero from "../components/hero/HeroV2";
import { paymentMethodsImages } from "../helpers";
import MostPopularItems from "../components/MostPopularItems";
import ProductVersionCardV2 from "../../products/components/ProductVersionCard";
import { OverflowXComponent } from "../components/OverflowXComponent";

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
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2003782983796640%2F&show_text=false&width=380&t=0",
            title: "En Cascos IGA fabricamos cascos certificados bajo la NOM-115-STPS-2009, cumpliendo con los estándares más altos de protección"
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FCascos.Iga%2Fvideos%2F1072011298391393%2F&show_text=false&width=380&t=0",
            title: "Cascos Iga  en  su ultimo día de actividades en la Expoferre 2025."
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1226019325980440%2F&show_text=false&width=267&t=0",
            title: "Banda de Sudor para Cascos"
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1369548547637737%2F&show_text=false&width=267&t=0",
            title: "💛 Sabemos que cada jornada comienza con esfuerzo… y debe terminar con un abrazo."
        },
        {
            videoUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1245484200499156%2F&show_text=false&width=267&t=0",
            title: "Conoce mas sobre nuestros cascos"
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
    } = useFetchProductVersionCardsV2({
        filters: {
            limit: MAX_PRODUCTS,
            random: true
        }
    });

    const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: ElementType }) => (
        <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-primary rounded-full shrink-0" />
                <h2 className="text-xl sm:text-2xl font-black text-base-content">{title}</h2>
            </div>
            {subtitle && (
                <p className="flex items-center gap-2 text-sm text-base-content/60 ml-4">
                    {Icon && <Icon className="text-primary text-base shrink-0" />}
                    {subtitle}
                </p>
            )}
        </div>
    );

    const sectionClasses = "py-12 md:py-16 scroll-mt-24";

    return (
        <div>
            <Hero />
            <div className="flex flex-col">
                <section className={clsx(sectionClasses, "border-t border-base-200/50")}>
                    <SectionHeader
                        title="Conoce nuestros cascos más populares"
                        subtitle="Los siempre confiables para tu seguridad"
                        icon={FaBox}
                    />
                    <MostPopularItems />
                </section>
                <section className={clsx(sectionClasses, "bg-base-200/20 border-t border-base-200/50")}>
                    <SectionHeader
                        title="Categorías principales"
                        subtitle="Desliza para conocer las categorías de artículos que tenemos para ti"
                        icon={FaBox}
                    />
                    <CategoriesSummary />
                </section>
                <section className={clsx(sectionClasses, "border-t border-base-200/50")}>
                    <SectionHeader
                        title="Formas de pago"
                        subtitle="Nos ajustamos a tu comodidad"
                        icon={PiHandbag}
                    />
                    <Marquee className="w-full" gradient={false} speed={80} direction="left">
                        <div className="flex gap-5 md:gap-10 items-center justify-center">
                            {paymentMethodsImages.map((img, index) => (
                                <figure key={index} className="w-28 md:w-48 p-4 rounded-xl bg-base-100 border border-base-200">
                                    <img className="w-full object-contain" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                </section>
                <section className={clsx(sectionClasses, "bg-base-200/20 border-t border-base-200/50")}>
                    <SectionHeader
                        title="Conoce nuestra marca"
                    />
                    <div className="flex flex-col gap-8 md:gap-12">
                        <div>
                            <SectionHeader
                                title="Videos"
                                subtitle="Desliza para ver videos que quizás te puedan interesar"
                                icon={FaVideo}
                            />
                            <OverflowXComponent className="flex gap-5 items-center">
                                {sampleVideos.map((video, index) => (
                                    <div key={index} className="flex flex-col w-60 md:w-64 flex-shrink-0 rounded-xl border border-base-200 bg-base-100 shadow-sm overflow-hidden">
                                        <p className="text-sm md:text-base font-semibold line-clamp-1 px-3 pt-3 text-base-content">{video.title}</p>
                                        <div className="w-full h-56 md:h-64 overflow-hidden bg-base-300 flex items-center justify-center">
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
                            </OverflowXComponent>
                        </div>
                        <div>
                            <SectionHeader
                                title="Exposiciones"
                                subtitle="Participaciones en exposiciones nacionales e internacionales"
                                icon={FaImage}
                            />
                            <Marquee className="w-full" gradient={false} speed={80}>
                                <div className="flex gap-5 md:gap-10 items-center justify-center">
                                    {[...imageGallery, ...imageGallery].map((img, index) => (
                                        <figure key={index} className="w-36 h-36 md:w-56 md:h-56 p-2 md:p-3 rounded-xl bg-base-100 border border-base-200">
                                            <img className="w-full h-full object-cover object-center rounded-lg" src={img.url} alt={img.description} loading="lazy" />
                                        </figure>
                                    ))}
                                </div>
                            </Marquee>
                        </div>
                    </div>
                </section>
                <section className={clsx(sectionClasses, "border-t border-base-200/50")}>
                    <SectionHeader
                        title="Productos que te pueden interesar"
                        subtitle="Conoce la selección de productos que tenemos para ti"
                        icon={BiPackage}
                    />

                    {isLoading && !error && !ads && (
                        <div className="w-full flex flex-wrap gap-6 mt-2">
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                        </div>
                    )}
                    {!isLoading && !ads && error && (
                        <div className="flex flex-col items-center gap-4 py-12 text-center">
                            <FaTriangleExclamation className="text-4xl text-error/60" />
                            <p className="text-lg font-bold text-base-content">Ocurrió un error inesperado</p>
                            <p className="text-error text-sm max-w-md">{getErrorMessage(error)}</p>
                            <button type="button" className="btn btn-primary mt-1" onClick={() => refetch()}>Reintentar</button>
                        </div>
                    )}
                    {!isLoading && !error && ads && (
                        <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                            {ads.data.map((data, index) => (
                                <ProductVersionCardV2 key={index} className={clsx("rounded-xl p-2", theme === "ligth" ? "bg-base-100" : "bg-transparent")} versionData={data} imageLoading="lazy" />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;