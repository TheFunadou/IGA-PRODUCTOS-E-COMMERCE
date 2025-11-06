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
import { GoHeart, GoHeartFill } from "react-icons/go";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import { GiMailedFist } from "react-icons/gi";
import { IoBuild } from "react-icons/io5";
import DistributorsIMG from "../../../assets/headers/IMG-2.png";


const Home = () => {
    const MAX_PRODUCTS: number = 8;
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
                    <p className="text-4xl font-bold text-blue-950">Tu seguridad es nuestra máxima prioridad</p>
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
                    <p className="text-4xl font-bold">Conoce nuestras categorias de productos</p>
                    <div className="w-full mt-2">
                        <ComponentCarousel />
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-4xl font-bold">Explora nuestros metodos de pago</p>
                    <div className="w-full mt-2">
                        <PaymentMethodsCarousel />
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-4xl font-bold">Novedades</p>
                    <div className="w-full flex mt-2 rounded-xl bg-white p-5">
                        <figure className="w-1/4 rounded-xl">
                            <img className="rounded-xl border border-gray-300" src="https://igaproductos.com.mx/wp-content/uploads/2023/11/Azul_001-1.jpg" alt="" />
                        </figure>
                        <div className="w-1/2 pl-5">
                            <p className="w-fit px-5 rounded-xl py-1 bg-primary text-white text-xl">Casco de seguridad industrial tipo coraza a</p>
                            <div className="mt-2">
                                <p className="w-70/100 text-4xl font-bold">Conoce más sobre nuestros cascos de seguridad industrial.</p>
                                <div className="mt-5 flex flex-col gap-5">
                                    <p className="flex items-center text-3xl gap-2"><span className="w-5/100"><figure><img src="https://isopixel.net/wp-content/uploads/2017/02/Logo-Hecho-en-Mexico-trans-350x350.png" alt="Hecho en México" /></figure></span>100% Hechos en México</p>
                                    <p className="w-fit text-2xl bg-gray-200 rounded-xl px-2 py-1 flex gap-2"><span><GiMailedFist className="text-3xl" /></span>Resistentes a impactos y peligros de alto votaje</p>
                                    <p className="w-fit text-2xl bg-gray-200 rounded-xl px-2 py-1 flex gap-2"><span><GoHeart className="text-3xl" /></span>Vida util de hasta 5 años en concha y 12 meses en suspensión</p>
                                    <p className="w-fit text-2xl bg-gray-200 rounded-xl px-2 py-1 flex gap-2"><span><GiMailedFist className="text-3xl" /></span>Resistentes a impactos y peligros de alto votaje</p>
                                    <p className="w-fit text-2xl bg-gray-200 rounded-xl px-2 py-1 flex gap-2"><span><IoBuild className="text-3xl" /></span>Fabricado en polietileno de alta densidad</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/4 border-l border-l-gray-300 flex flex-col items-center gap-3">
                            <p className="text-lg">Certificados por:</p>
                            <figure className="w-1/2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/ISO_9001-2015.svg/1200px-ISO_9001-2015.svg.png" alt="ISO 9001:2015" />
                            </figure>
                            <div>
                                <p className="text-lg">Cumplimientos normativos</p>
                                <div className="mt-2 flex flex-col gap-2 items-center">
                                    <p>NOM-115-STPS-2009</p>
                                    <p>NMX-S-055-SCFI-2022</p>
                                    <p>CFE 8H 341-02</p>
                                    <p>PEMEX-EST-SS-058-2018</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-5">
                    <div className="flex gap-5">
                        <div className="w-1/2 p-5 bg-white rounded-xl">
                            <div className="w-full bg-base-300 px-5 py-2 rounded-xl flex">
                                <div>
                                    <p className="text-2xl font-bold">Conoce a nuestros distribuidores oficiales</p>
                                    <p className=" w-1/2">Encuentra a nuestros distribuidores autorizados mas cercanos a ti</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 p-5 bg-white rounded-xl">
                            <div className="w-full bg-base-300 px-5 py-2 rounded-xl flex">
                                <div>
                                    <p className="text-2xl font-bold">Conoce a nuestros distribuidores oficiales</p>
                                    <p className=" w-1/2">Encuentra a nuestros distribuidores autorizados mas cercanos a ti</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-5">
                    <p className="text-4xl font-bold">Productos que pueden interesarte</p>
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