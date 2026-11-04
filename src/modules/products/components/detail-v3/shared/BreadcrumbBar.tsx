import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

/* Barra superior pegajosa con breadcrumb (compartida por mobile y desktop) */
interface BreadcrumbBarProps {
    categoryName: string;
    productName: string;
}

// Pide a la tienda que restaure la categoría, filtros, página y scroll guardados.
const restoreShopState = { restoreShopScroll: true };

const BreadcrumbBar = ({ categoryName, productName }: BreadcrumbBarProps) => (
    <div className="sticky top-0 z-30 bg-base-100/90 backdrop-blur border-b border-base-200">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-3">
            {/* min-w-0 defensivo: el nav flex se contrae para que el texto trunque en vez de expandir la página */}
            <nav className="flex items-center gap-1.5 w-full min-w-0 text-xs font-bold" aria-label="Breadcrumb">
                <Link
                    to="/"
                    state={restoreShopState}
                    className="btn btn-ghost btn-xs sm:btn-sm gap-1.5 -ml-2 px-2 text-base-content/70 hover:text-primary"
                >
                    <FaArrowLeft className="text-[10px]" />
                    <span className="hidden sm:inline">Volver a la tienda</span>
                    <span className="sm:hidden">Tienda</span>
                </Link>
                <span className="text-base-content/30 select-none">/</span>
                {/* Tienda integrada en Home (/#tienda) - link comentado, se preserva categoría */}
                {/* <Link to="/tienda" className="hidden sm:inline text-base-content/50 hover:text-primary transition-colors">Tienda</Link>
                <span className="hidden sm:inline text-base-content/30 select-none">/</span> */}
                <Link
                    to={`/?category=${encodeURIComponent(categoryName)}`}
                    state={restoreShopState}
                    className="hidden md:inline text-base-content/50 hover:text-primary transition-colors w-fit truncate sm:overflow-visible sm:whitespace-normal sm:text-clip"
                >
                    {categoryName}
                </Link>
                <span className="hidden md:inline text-base-content/30 select-none">/</span>
                <span className="text-base-content/85 w-full truncate sm:overflow-visible sm:whitespace-normal sm:text-clip">{productName}</span>
            </nav>
            <div className="flex items-center gap-2 shrink-0">
            </div>
        </div>
    </div>
);

export default BreadcrumbBar;
