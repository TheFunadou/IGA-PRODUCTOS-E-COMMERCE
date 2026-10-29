import PurchaseCard, { type PurchaseCardProps } from "../shared/PurchaseCard";
import { AutomaticDiscountBadge } from "../shared/ContactBadges";

/* Bloque de compra móvil: PurchaseCard + badge de descuento por mayoreo */
const MobilePurchaseBlock = (props: PurchaseCardProps) => (
    <div className="lg:hidden">
        <PurchaseCard {...props} />
        <div className="mt-2.5">
            <AutomaticDiscountBadge />
        </div>
    </div>
);

export default MobilePurchaseBlock;
