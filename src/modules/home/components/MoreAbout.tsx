import ElectroProtection from "../../../assets/home/electroprotection.webp"
import IndustryAndConstruction from "../../../assets/home/industryandconstruction.webp"
import WorkAtHeight from "../../../assets/home/workiatheights.webp"
import { useFetchSelectedHelmets } from "../../products/hooks/useFetchProductVersionCards";
import ProductVersionCardV3Skeleton from "../../products/components/ProductVersionCardV3Skeleton";
import SelectedHelmetCard from "./SelectedHelmetCard";
import Marquee from "react-fast-marquee";
import { paymentMethodsImages } from "../helpers";
import { useShopExternalTagsStore } from "../../shop/states/shopExternalTagsStore";
import { useCartTagStore } from "../../shopping/stores/cartTagStore";



const ChoseYourHelmet = (params: {
    imgUrl: string,
    title: string,
    tagNames: string[]
}) => {
    const requestTagFilter = useShopExternalTagsStore((s) => s.requestTagFilter);
    const addTags = useCartTagStore((s) => s.addTags);

    return (
        <div className="card bg-base-100 w-full max-w-96 lg:w-96 lg:max-w-none shadow-sm">
            <figure>
                <img
                    src={params.imgUrl}
                    alt="Shoes" />
            </figure>
            <div className="card-body flex items-center justify-center">
                <h2 className="card-title text-blue-950 font-bold text-2xl">{params.title}</h2>
                <div className="card-actions justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            addTags(params.tagNames);
                            requestTagFilter(params.tagNames);
                        }}
                        className="btn bg-blue-950 text-white btn-lg rounded-xl"
                    >
                        Ver opciones
                    </button>
                </div>
            </div>
        </div>
    )
};

export const MoreAbout = () => {
    const { data: selectedHelmets, isLoading: helmetsLoading } = useFetchSelectedHelmets();

    return (
        <div className="flex items-center justify-center flex-col py-10 lg:py-20">
            <div className="w-full px-4 sm:px-6 lg:px-0 lg:w-80/100 flex flex-col gap-12 lg:gap-20">
                <section>
                    <div>
                        <h1 className="text-blue-950 text-3xl sm:text-4xl lg:text-5xl text-center">Encuentra tu Casco Iga ideal</h1>
                        <p className="text-center mt-2 text-primary text-lg lg:text-xl">Selecciona según tu tipo de operación</p>
                    </div>
                    <div className="mt-5 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                        <ChoseYourHelmet
                            key={"card-1"}
                            imgUrl={IndustryAndConstruction}
                            title="Industria y construcción"
                            tagNames={["industria", "construccion"]}
                        />
                        <ChoseYourHelmet
                            key={"card-2"}
                            imgUrl={WorkAtHeight}
                            title="Trabajos en altura"
                            tagNames={["trabajos en alturas"]}
                        />
                        <ChoseYourHelmet
                            key={"card-3"}
                            imgUrl={ElectroProtection}
                            title="Protección electrica"
                            tagNames={["Clase E (Dielectrico)"]}
                        />
                    </div>
                </section>
                <section>
                    <div>
                        <h1 className="text-blue-950 text-3xl sm:text-4xl lg:text-5xl text-center">Modelos más buscados</h1>
                    </div>
                    <div className="mt-5">
                        {helmetsLoading && (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductVersionCardV3Skeleton key={i} viewMode="grid" />
                                ))}
                            </div>
                        )}
                        {!helmetsLoading && selectedHelmets && selectedHelmets.data.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                                {selectedHelmets.data.map((card) => (
                                    <SelectedHelmetCard
                                        key={`${card.version.sku}-${card.product.id}`}
                                        data={card}
                                        imageLoading="lazy"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                <section>
                    <Marquee className="w-full" gradient={false} speed={80} direction="left">
                        <div className="flex gap-5 md:gap-10 items-center justify-center">
                            {paymentMethodsImages.map((img, index) => (
                                <figure key={index} className="w-28 md:w-48 p-4 rounded-xl ">
                                    <img className="w-full object-contain" src={img.image_url} alt={img.description} loading="lazy" />
                                </figure>
                            ))}
                        </div>
                    </Marquee>
                </section>
            </div>
        </div>
    );
};

export default MoreAbout;