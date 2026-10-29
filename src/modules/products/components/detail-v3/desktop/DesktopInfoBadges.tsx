import {
    OutOfStockInquiryBadge, PausedInquiryBadge, SupportBadge, VolumeQuoteBadge
} from "../shared/ContactBadges";

/* Badges de contacto (desktop): columna completa bajo las specs */
interface DesktopInfoBadgesProps {
    productName: string;
    sku: string;
    productIsPaused: boolean;
    stock: number;
}

const DesktopInfoBadges = ({ productName, sku, productIsPaused, stock }: DesktopInfoBadgesProps) => (
    <div className="hidden lg:flex flex-col gap-2.5">
        <SupportBadge productName={productName} sku={sku} />
        <VolumeQuoteBadge productName={productName} sku={sku} />
        {productIsPaused && <PausedInquiryBadge productName={productName} sku={sku} />}
        {!productIsPaused && stock <= 0 && <OutOfStockInquiryBadge productName={productName} sku={sku} />}
    </div>
);

export default DesktopInfoBadges;
