import { getErrorMessage } from "../../../global/GlobalUtils";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";
import Marquee from "react-fast-marquee";
import CategoriesSummary from "../components/CategoriesSummary";
import { FaBox, FaTriangleExclamation } from "react-icons/fa6";
import { PiHandbag } from "react-icons/pi";
import { BiPackage } from "react-icons/bi";
import type { ElementType } from "react";
import { useFetchProductVersionCardsV2 } from "../../products/hooks/useFetchProductVersionCards";
import Hero from "../components/hero/HeroV2";
import { paymentMethodsImages } from "../helpers";
import MostPopularItems from "../components/MostPopularItems";
import ProductVersionCardV2 from "../../products/components/ProductVersionCard";

const Home = () => {

    document.title = "Iga Productos | Fabricantes y vendedores de equipo de protección personal";
    const { theme } = useThemeStore();

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