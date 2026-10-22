import NotFoundSVG from "../../../../assets/products/NotFound.svg";
import { makeSlug } from "../../../products/Helpers";
import type { PV3CardData } from "../../../products/ProductTypes";
import type { PromoCarouselItem } from "./PromoCarousel";

/** Item de promoción extendido con el UUID del producto (por si el consumidor lo necesita). */
export type PromoItem = PromoCarouselItem & { productUUID: string };

/**
 * Mapea cards V3 del catálogo a items del tile promocional:
 * - imageUrl: imagen principal (isMain primero); fallback a NotFoundSVG.
 * - offDisc: presente solo cuando hay oferta activa con descuento.
 * - href: URL de detalle `/tienda/{categoría}/{slug}/{sku}`.
 */
export const mapPV3CardsToPromoItems = (cards: PV3CardData[]): PromoItem[] =>
    cards.map((card) => {
        const { product, version } = card;
        const sortedImages = [...(version.images || [])]
            .sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1))
            .map((img) => img.url);

        return {
            id: `${version.sku}-${product.id}`,
            imageUrl: sortedImages[0] ?? version.image_url ?? NotFoundSVG,
            offDisc: version.offer?.isOffer && version.offer.discount ? version.offer.discount : undefined,
            href: `/tienda/${makeSlug(product.category.name)}/${makeSlug(product.product_name)}/${version.sku.toLowerCase()}`,
            productUUID: product.uuid,
        };
    });
