import InfiniteCarousel from "../components/InfinteCarousel";
import header_1 from "../../../assets/carousel/header-1.jpg"
// import MainProductCard from "../../products/components/ProductVersionCardSkinny";
import ComponentCarousel from "../components/ComponentCarousel";
import PaymentMethodsCarousel from "../components/PaymentMethodsCarousel";
import { FaShippingFast } from "react-icons/fa";
import { BsFillSafe2Fill } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import ProductVersionCard from "../../products/components/ProductVersionCard";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { useFetchProductVersionCards } from "../../products/hooks/useFetchProductVersionCards";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";


const Home = () => {
    const MAX_PRODUCTS:number = 8;
    const sampleImages: string[] = [
        header_1,
        header_1,
        header_1,
        header_1,
    ];

    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchAds({ limit: MAX_PRODUCTS, entity: "ads" });


    return (
        <div>
            <div className="w-full animate-fade-in-up">
                <InfiniteCarousel
                    images={sampleImages}
                    autoPlayInterval={4000}
                    showControls={true}
                    showDots={true}
                />
            </div>
            <div className="mt-10">
                <div className="w-full animate-fade-in-up">
                    <p className="text-5xl font-bold text-blue-950">Tu seguridad es nuestra máxima prioridad</p>
                    <div className="w-full flex items-center justify-center gap-20 text-blue-950 py-5 [&_div]:flex [&_div]:flex-col [&_div]:items-center [&_div]:justify-center">
                        <div>
                            <p className="text-3xl font-bold">Pago Seguro</p>
                            <MdOutlineHealthAndSafety className="text-[200px] text-blue-950" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">Seguridad en Entregas</p>
                            <FaShippingFast className="text-[200px] text-blue-950" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">Protección de datos</p>
                            <BsFillSafe2Fill className="text-[200px] text-blue-950" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">Soporte en compras</p>
                            <RiShoppingCartFill className="text-[200px] text-blue-950" />
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-3xl font-bold">Conoce nuestras categorias de productos</p>
                    <div className="w-full mt-2">
                        <ComponentCarousel />
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-3xl font-bold">Explora nuestros metodos de pago</p>
                    <div className="w-full mt-2">
                        <PaymentMethodsCarousel />
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-3xl font-bold">Productos que pueden interesarte</p>
                    {isLoading ? (
                        <div className="w-full flex flex-wrap gap-10 mt-5">
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                            <ProductVersionCardSkeleton />
                        </div>
                    ) : (
                        <div className="w-full">
                            {error ? (
                                <div className="py-5">
                                    <p className="text-error py-5 text-lg">{getErrorMessage(error)}</p>
                                    <button type="button" className="btn btn-primary mt-5" onClick={() => refetch()}>Reintentar?</button>
                                </div>
                            ) : (
                                <div className="w-full flex flex-wrap gap-10 mt-5">
                                    {data && data.map((data, index) => (
                                        <ProductVersionCard key={index} className="w-100 h-165 rounded-xl" versionData={data} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;