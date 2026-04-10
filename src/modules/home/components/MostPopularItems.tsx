import { useNavigate } from "react-router-dom";
import { OverflowXComponent } from "./OverflowXComponent";
import { makeSlug } from "../../products/Helpers";

type Subcategory = { name: string; uuid: string };

type PopularItemData = {
    imageUrl: string;
    data: { sku: string; name: string };
    subcategories: Subcategory[];
};

const buildSubcategoryUrl = (subcategories: Subcategory[], clickedIndex: number): string => {
    const slice = subcategories.slice(0, clickedIndex + 1);
    const params = slice.map(s => `&sub=${s.uuid}`).join("");
    return `/tienda?category=cascos${params}&page=1`;
};

const buildProductVersionUrl = (sku: string, name: string) => {
    const slug = makeSlug(name);
    return `/tienda/cascos/${slug}/${sku.toLocaleLowerCase()}`
};

const MostPopularItemCard = ({
    imageUrl,
    data,
    subcategories,
}: PopularItemData) => {
    const navigate = useNavigate();

    const handleNavigate = (clickedIndex: number) => {
        const url = buildSubcategoryUrl(subcategories, clickedIndex);
        navigate(url);
    };

    const handleNavigateToDetails = (sku: string, name: string) => {
        const url = buildProductVersionUrl(sku, name);
        navigate(url);
    }

    return (
        <article
            className="
                group relative flex-shrink-0
                w-56 md:w-96
                rounded-2xl overflow-hidden
                border border-base-300
                bg-base-100
                shadow-sm
                hover:shadow-xl hover:border-primary/40
                hover:-translate-y-1
                transition-all duration-300 ease-out
                flex flex-col
            "
        >
            {/* Hero image */}
            <figure className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-base-200 cursor-pointer"
                onClick={() => handleNavigateToDetails(data.sku, data.name)}
            >
                <img
                    src={imageUrl}
                    alt={data.name}
                    loading="lazy"
                    className="
                        w-full h-full object-contain
                        transition-transform duration-500 ease-out
                        group-hover:scale-105
                    "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>

            {/* Body */}
            <div className="flex flex-col gap-2 px-3 pt-3 pb-4 flex-1">
                {/* SKU badge */}
                <div className="badge badge-primary tracking-widest text-[10px]">
                    {data.sku}
                </div>

                {/* Product name */}
                <p className="text-sm font-medium leading-snug line-clamp-2 text-base-content">
                    {data.name}
                </p>

                {/* Subcategory badges */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {subcategories.map((sub, index) => (
                        <span
                            key={sub.uuid}
                            onClick={() => handleNavigate(index)}
                            className="
                                badge badge-outline
                                text-[10px] cursor-pointer
                                hover:badge-primary
                                transition-all duration-200
                            "
                        >
                            {sub.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
        </article>
    );
};

const items: PopularItemData[] = [
    {
        imageUrl: "https://proyeccionempresarial.com.mx/wp-content/igaproductos/cascos/plagosur/ai/CAS1-AI-AI2-006-1.webp",
        data: { sku: "CAS1-AI-006", name: "Casco de Seguridad Industrial Marca IGA Modelo Cachucha Plagosur, Ajuste de Intervalo, Clase E" },
        subcategories: [
            { name: "Casco de Seguridad Industrial", uuid: "gYGhgUO4GHBECXninMd9R" },
            { name: "Cachucha Plagosur", uuid: "MGsO-l2wLlxLE-wN7jnaU" },
            { name: "Ajuste de Intervalo", uuid: "9oUlLNNuCcDHk-lC4Iz79" },
            { name: "Clase E", uuid: "LJhoqR2WL4txAK0CKWiDk" },
        ],
    },
    {
        imageUrl: "https://proyeccionempresarial.com.mx/wp-content/igaproductos/cascos/coraza/CAS2-AM1-005-3.webp",
        data: { sku: "CAS2-AM1-005", name: "Casco de Seguridad Industrial IGA tipo Coraza (Ala Ancha)" },
        subcategories: [
            { name: "Casco de Seguridad Industrial", uuid: "gYGhgUO4GHBECXninMd9R" },
            { name: "Coraza (Ala Ancha)", uuid: "FLGrHXv6Te8VmR56SY6hS" },
            { name: "Ajuste de Matraca", uuid: "K1cYZD21hXb4E-YuVJcD4" },
            { name: "Clase E", uuid: "9GD-yq-Y27goLwMOJD0Ub" },
        ],
    },
    {
        imageUrl: "https://proyeccionempresarial.com.mx/wp-content/igaproductos/cascos/hit/am/CAS3-AM2-004-1.webp",
        data: { sku: "CAS3-AM2-004", name: "Casco de Seguridad Industrial Marca IGA Modelo Cachucha Hit, Ajuste de Matraca, Clase G" },
        subcategories: [
            { name: "Casco de Seguridad Industrial", uuid: "gYGhgUO4GHBECXninMd9R" },
            { name: "Cachucha Hit", uuid: "XyGUdWja-eBMNsXdN0Gvj" },
            { name: "Ajuste de Intervalo", uuid: "DMeVpVLOpf4G1uyUgZ1Nk" },
            { name: "Clase G", uuid: "XKCigj1F7rh3901CNpQi4" },
        ],
    },
    {
        imageUrl: "https://proyeccionempresarial.com.mx/wp-content/igaproductos/cascos/wings/CAS4-AM1-001-3.webp",
        data: { sku: "CAS4-AM1-001", name: "Casco de Seguridad de Alturas Modelo Wings Ajuste de Matraca, Clase C" },
        subcategories: [
            { name: "Casco de Alturas", uuid: "a4d5fd82f46d4dbb" },
        ],
    },
];

const MostPopularItems = () => {
    return (
        <OverflowXComponent className="flex gap-4 md:gap-6 mt-2 pb-2 justify-between">
            {items.map((item, index) => (
                <MostPopularItemCard key={index} {...item} />
            ))}
        </OverflowXComponent>
    );
};

export default MostPopularItems;