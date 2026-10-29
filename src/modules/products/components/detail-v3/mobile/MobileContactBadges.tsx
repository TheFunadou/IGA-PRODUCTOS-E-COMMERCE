import {
    OutOfStockInquiryBadge, PausedInquiryBadge, SupportBadge, VolumeQuoteBadge
} from "../shared/ContactBadges";

/* Badges de contacto (mobile): soporte + cotización en volumen (+ condicional
   de pausado / sin stock), apilados en mobile y en fila desde sm */
interface MobileContactBadgesProps {
    productName: string;
    sku: string;
    productIsPaused: boolean;
    stock: number;
}

const MobileContactBadges = ({ productName, sku, productIsPaused, stock }: MobileContactBadgesProps) => (
    <>
        <div className="lg:hidden flex flex-col sm:flex-row gap-2.5 mt-6">
            <SupportBadge productName={productName} sku={sku} />
            <VolumeQuoteBadge productName={productName} sku={sku} />
        </div>
        {productIsPaused && (
            <div className="lg:hidden mt-2.5">
                <PausedInquiryBadge productName={productName} sku={sku} />
            </div>
        )}
        {!productIsPaused && stock <= 0 && (
            <div className="lg:hidden mt-2.5">
                <OutOfStockInquiryBadge productName={productName} sku={sku} />
            </div>
        )}
    </>
);

export default MobileContactBadges;
