import PurchaseCard, { type PurchaseCardProps } from "../shared/PurchaseCard";
import { AutomaticDiscountBadge } from "../shared/ContactBadges";

/* Columna de compra desktop (3a columna del grid, sticky) */
const DesktopPurchaseColumn = (props: PurchaseCardProps) => (
    <div className="hidden lg:block lg:col-span-3">
        <div className="sticky top-16 flex flex-col gap-4">
            <PurchaseCard {...props} />
            <AutomaticDiscountBadge />
        </div>
    </div>
);

export default DesktopPurchaseColumn;
