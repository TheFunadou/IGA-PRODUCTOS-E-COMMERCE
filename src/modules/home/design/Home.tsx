import InfiniteCarousel from "../components/InfinteCarousel";
import { getErrorMessage } from "../../../global/GlobalUtils";
import { GoHeart } from "react-icons/go";
import ProductVersionCardSkeleton from "../../products/components/ProductVersionCardSkeleton";
import { useFetchAds } from "../../../layouts/hooks/useAds";
import { GiMailedFist } from "react-icons/gi";
import { IoBuild } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { TiWorld } from "react-icons/ti";
import ProductVersionCardShop from "../../products/components/ProductVersionCardShop";
import Carousel from "../components/Carousel";
import CategoriesCarousel from "../components/CategoriesCarousel";
import { LiaCertificateSolid } from "react-icons/lia";
import PaymentMethodsImgsJSON from "../json/PaymentMethodsCarouselImgs.json";
import { BiCheckCircle } from "react-icons/bi";
import IMG1 from "../../../assets/expo/IMG-1.webp";
import IMG2 from "../../../assets/expo/IMG-2.webp";
import IMG3 from "../../../assets/expo/IMG-3.webp";
import IMG4 from "../../../assets/expo/IMG-4.webp";
import IMG5 from "../../../assets/expo/IMG-5.webp";
import IMG6 from "../../../assets/expo/IMG-6.webp";
import IMG7 from "../../../assets/expo/IMG-7.webp";
import IMG8 from "../../../assets/expo/IMG-8.webp";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import { InfoMainImgs } from "../json/assets";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import clsx from "clsx";
import { useThemeStore } from "../../../layouts/states/themeStore";

const Home = () => {

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
    ]

    const { theme } = useThemeStore();
    const MAX_PRODUCTS: number = 10;
    const sampleImages: string[] = [
        "https://scontent.fmtt1-1.fna.fbcdn.net/v/t39.30808-6/468992413_9834351113258614_9122293369068717942_n.jpg?_nc_cat=111&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGUuzQUJhriKArZpbDCFX2-OcZbmscgXzE5xluaxyBfMU3ajukD9jR_DPaL37_BVuAnuD6i8r_sQXbTCaWr_MZL&_nc_ohc=Ir9kilVDl8sQ7kNvwE1hKaT&_nc_oc=AdmqzUtclOXMIPZjBzKP4RmbfGXaYTbfyjLeAPvgXSIhFey1pzJgsqRBZ_eGN9CPJwMEoCL-Ot9AyvRmr8Ma16Q-&_nc_zt=23&_nc_ht=scontent.fmtt1-1.fna&_nc_gid=hTdhLTtRTHvqp2KZEbX4LA&oh=00_Afm-qxnhVLvEoiMZqI12NnqsezXzntI16JCqaWPHJeEotw&oe=693CF52B",
        "https://scontent.fmtt1-1.fna.fbcdn.net/v/t39.30808-6/468992413_9834351113258614_9122293369068717942_n.jpg?_nc_cat=111&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGUuzQUJhriKArZpbDCFX2-OcZbmscgXzE5xluaxyBfMU3ajukD9jR_DPaL37_BVuAnuD6i8r_sQXbTCaWr_MZL&_nc_ohc=Ir9kilVDl8sQ7kNvwE1hKaT&_nc_oc=AdmqzUtclOXMIPZjBzKP4RmbfGXaYTbfyjLeAPvgXSIhFey1pzJgsqRBZ_eGN9CPJwMEoCL-Ot9AyvRmr8Ma16Q-&_nc_zt=23&_nc_ht=scontent.fmtt1-1.fna&_nc_gid=hTdhLTtRTHvqp2KZEbX4LA&oh=00_Afm-qxnhVLvEoiMZqI12NnqsezXzntI16JCqaWPHJeEotw&oe=693CF52B",
        "https://scontent.fmtt1-1.fna.fbcdn.net/v/t39.30808-6/468992413_9834351113258614_9122293369068717942_n.jpg?_nc_cat=111&_nc_cb=99be929b-ad57045b&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGUuzQUJhriKArZpbDCFX2-OcZbmscgXzE5xluaxyBfMU3ajukD9jR_DPaL37_BVuAnuD6i8r_sQXbTCaWr_MZL&_nc_ohc=Ir9kilVDl8sQ7kNvwE1hKaT&_nc_oc=AdmqzUtclOXMIPZjBzKP4RmbfGXaYTbfyjLeAPvgXSIhFey1pzJgsqRBZ_eGN9CPJwMEoCL-Ot9AyvRmr8Ma16Q-&_nc_zt=23&_nc_ht=scontent.fmtt1-1.fna&_nc_gid=hTdhLTtRTHvqp2KZEbX4LA&oh=00_Afm-qxnhVLvEoiMZqI12NnqsezXzntI16JCqaWPHJeEotw&oe=693CF52B",
    ];
    const {
        data,
        isLoading,
        error,
        refetch
    } = useFetchAds({ limit: MAX_PRODUCTS, entity: "ads" });


    return (
        <div>
            {/* <div className="w-full animate-fade-in-up">
                <InfiniteCarousel
                    images={sampleImages}
                    autoPlayInterval={4000}
                    showControls={true}
                    showDots={true}
                />
            </div> */}
            <div className="mt-10">
                <div className="w-full animate-fade-in-up">
                    <p className="text-4xl font-bold">Tu seguridad es nuestra máxima prioridad</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"><MdOutlineHealthAndSafety className="text-primary text-2xl" />Queremos inspirar seguridad para ti!</p>
                    <div className="w-full mt-5 flex items-center justify-center [&_div]:h-80 [&_div]:flex [&_div]:flex-col [&_div]:items-center [&_div]:justify-start [&_div]:flex-1">
                        {InfoMainImgs.map((data, index) => (
                            <div key={index} className="flex-1">
                                <figure className="w-60/100"><img src={data.image_url} alt={data.description} /></figure>
                                <p className="text-3xl font-semibold mt-2">{data.description}</p>
                            </div>
                        ))}

                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-4xl font-bold">Categorias de productos</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"><AiFillProduct className="text-primary text-2xl" />Conoce las diversas categorias de productos que tenemos para ti!</p>
                    <CategoriesCarousel className="mt-5" />
                </div>
                <div className="w-full mt-10">
                    <p className="text-4xl font-bold">Explora las diversas formas y lugares en los que puedes pagar tus pedidos</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"> <IoBagCheckOutline className="text-primary text-2xl" /> Nos ajustamos a tu comodidad</p>
                    <Carousel auto>
                        <div className="flex gap-10 mt-3 [&_div]:shadow-lg">
                            {PaymentMethodsImgsJSON && PaymentMethodsImgsJSON.map((img, index) => (
                                <div key={index} className={clsx("w-80 h-50 rounded-xl flex-shrink-0 flex items-center justify-center", theme === "ligth" && "bg-white", theme === "dark" && "bg-gray-300")}>
                                    <figure className="w-full p-5">
                                        <img className="w-full " src={img.image_url} alt={img.description} />
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </Carousel>
                </div>
                <div className="w-full mt-10">
                    <p className="text-4xl font-bold">Videos</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"> <IoBagCheckOutline className="text-primary text-2xl" /> Nos ajustamos a tu comodidad</p>
                    <Carousel className="flex gap-5 items-center mt-5">
                        {sampleVideos.map((video, index) => (
                            <div key={index}>
                                <p className="text-lg font-medium line-clamp-1">{video.title}</p>
                                <iframe src={video.videoUrl} width="380" height="476" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen className="rounded-xl"></iframe>
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="w-full pt-10">
                    <p className="text-4xl font-bold">Proyección de marca</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"><BiCheckCircle className="text-primary text-2xl" />Participamos en las expoferias mas importantes de México</p>
                    {/* <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-5"> */}

                    <Carousel auto>
                        <div className="flex gap-5 ">
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 1</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG1} alt="IMG 1" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 2</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG2} alt="IMG 2" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 3</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG4} alt="IMG 3" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 4</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG3} alt="IMG 4" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 5</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG5} alt="IMG 5" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 6</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG6} alt="IMG 6" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 7</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG7} alt="IMG 7" />
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <p>Imagen 8</p>
                                <img className="w-full mb-4 rounded-lg" src={IMG8} alt="IMG 8" />
                            </div>
                        </div>
                    </Carousel>
                    {/* </div> */}
                </div>
                <div className="w-full mt-10">
                    <p className="text-4xl font-bold">¿Sabias qué?</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"><IoMdInformationCircleOutline className="text-primary text-2xl" />Informate sobre nuestros productos mas destacados</p>
                    <div className={`w-full flex mt-2 rounded-xl p-5 ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                        <figure className="w-1/4 rounded-xl">
                            <img className="rounded-xl border border-gray-300" src="https://igaproductos.com.mx/wp-content/uploads/2023/11/Azul_001-1.jpg" alt="" />
                        </figure>
                        <div className="w-1/2 pl-5">
                            <p className="w-fit px-5 rounded-xl py-1 bg-primary text-white text-xl">Casco de seguridad industrial tipo coraza a</p>
                            <div className="mt-2">
                                <p className="w-70/100 text-4xl font-bold">Conoce más sobre nuestros cascos de seguridad industrial.</p>
                                <div className="mt-5 flex flex-col gap-5">
                                    <div className="flex items-center text-3xl gap-2"><span className="w-5/100"><figure><img src="https://isopixel.net/wp-content/uploads/2017/02/Logo-Hecho-en-Mexico-trans-350x350.png" alt="Hecho en México" /></figure></span>100% Hechos en México</div>
                                    <p className={`w-fit text-2xl rounded-xl px-2 py-1 flex gap-2 ${theme === "ligth" ? "bg-gray-200" : "bg-gray-800"}`}><span><LiaCertificateSolid className="text-3xl" /></span>Calidad certificada</p>
                                    <p className={`w-fit text-2xl rounded-xl px-2 py-1 flex gap-2 ${theme === "ligth" ? "bg-gray-200" : "bg-gray-800"}`}><span><GoHeart className="text-3xl" /></span>Vida util de hasta 5 años en concha y 12 meses en suspensión</p>
                                    <p className={`w-fit text-2xl rounded-xl px-2 py-1 flex gap-2 ${theme === "ligth" ? "bg-gray-200" : "bg-gray-800"}`}><span><GiMailedFist className="text-3xl" /></span>Resistentes a impactos y peligros de alto votaje</p>
                                    <p className={`w-fit text-2xl rounded-xl px-2 py-1 flex gap-2 ${theme === "ligth" ? "bg-gray-200" : "bg-gray-800"}`}><span><IoBuild className="text-3xl" /></span>Fabricado en polietileno de alta densidad</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/4 border-l border-l-gray-300 flex flex-col items-center gap-3">
                            <p className="text-lg">Certificados por:</p>
                            <figure className="w-1/2">
                                <img className="rounded-xl" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/ISO_9001-2015.svg/1200px-ISO_9001-2015.svg.png" alt="ISO 9001:2015" />
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
                <div className="w-full mt-10">
                    <div className="flex gap-5">
                        <div className={`w-1/2 p-5 rounded-xl ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                            <div className="w-full px-5 py-2 rounded-xl flex items-start gap-2">
                                <AiOutlineGlobal className="text-8xl text-primary" />
                                <div>
                                    <p className="text-2xl font-bold underline text-primary">Conoce a nuestros distribuidores oficiales</p>
                                    <p className=" w-60/100">Encuentra a nuestros distribuidores autorizados mas cercanos a ti</p>
                                </div>
                            </div>
                        </div>
                        <div className={`w-1/2 p-5 rounded-xl ${theme === "ligth" ? "bg-white" : "bg-gray-950"}`}>
                            <div className="w-full px-5 py-2 rounded-xl flex items-start gap-2">
                                <TiWorld className="text-8xl text-primary" />
                                <div>
                                    <p className="text-2xl font-bold underline text-primary">Cada día mas cerca de ti</p>
                                    <p className=" w-full">Explora nuestra cobertura nacional e internacional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-10">
                    <p className="text-4xl font-bold">Productos que pueden interesarte</p>
                    <p className="text-2xl font-medium flex gap-2 items-center"><AiFillProduct className="text-primary text-2xl" />Ve la seleccion de productos que tenemos para ti!</p>
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
                                <div className="w-full flex flex-wrap gap-10 mt-5 px-10">
                                    {data && data.map((data, index) => (
                                        <ProductVersionCardShop key={index} className={clsx("rounded-xl p-2", theme === "ligth" ? "bg-white" : "bg-transparent")} versionData={data} />
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