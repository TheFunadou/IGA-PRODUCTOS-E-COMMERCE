/* Header de info desktop: nombre + SKU + rating (en mobile el SKU va como
   badge sobre la imagen y el rating bajo el nombre) */
interface DesktopInfoHeaderProps {
    name: string;
    skuBadgeBlock: React.ReactNode;
    ratingBlock: React.ReactNode;
}

const DesktopInfoHeader = ({ name, skuBadgeBlock, ratingBlock }: DesktopInfoHeaderProps) => (
    <div className="hidden lg:flex lg:flex-col gap-3">
        <h1 className="hidden lg:block text-2xl sm:text-3xl xl:text-4xl font-black leading-tight text-base-content tracking-tight break-words">
            {name}
        </h1>
        <div className="hidden lg:block">
            {skuBadgeBlock}
        </div>
        <div className="hidden lg:block">
            {ratingBlock}
        </div>
    </div>
);

export default DesktopInfoHeader;
