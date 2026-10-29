import { FaFileLines, FaTriangleExclamation } from "react-icons/fa6";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import PdfViewerModal from "../components/PdfViewerModal";
import ProductVersionImageGallery from "../components/ProductVersionImageGallery";
import { useProductVersionDetailV3Controller } from "../hooks/useProductVersionDetailV3Controller";

import BreadcrumbBar from "../components/detail-v3/shared/BreadcrumbBar";
import ProductGallery from "../components/detail-v3/shared/ProductGallery";
import ColorSpecRow from "../components/detail-v3/shared/ColorSpecRow";
import QuickSpecsList from "../components/detail-v3/shared/QuickSpecsList";
import DetailTabs from "../components/detail-v3/shared/DetailTabs";
import ResourcesPanel from "../components/detail-v3/shared/ResourcesPanel";
import TrustStrip from "../components/detail-v3/shared/TrustStrip";
import { RatingBlock, SkuBadgeBlock } from "../components/detail-v3/shared/RatingBlock";
import ReviewsSection from "../components/detail-v3/shared/reviews/ReviewsSection";

import MobileTitleSection from "../components/detail-v3/mobile/MobileTitleSection";
import MobileVersionsRow from "../components/detail-v3/mobile/MobileVersionsRow";
import MobilePurchaseBlock from "../components/detail-v3/mobile/MobilePurchaseBlock";
import MobileContactBadges from "../components/detail-v3/mobile/MobileContactBadges";

import DesktopTags from "../components/detail-v3/desktop/DesktopTags";
import DesktopInfoHeader from "../components/detail-v3/desktop/DesktopInfoHeader";
import DesktopVersions from "../components/detail-v3/desktop/DesktopVersions";
import DesktopInfoBadges from "../components/detail-v3/desktop/DesktopInfoBadges";
import DesktopPurchaseColumn from "../components/detail-v3/desktop/DesktopPurchaseColumn";

import SimilarProducts from "../components/detail-v3/SimilarProducts";

/* Página de detalle de producto V3: solo composición. Toda la lógica vive en
   useProductVersionDetailV3Controller; los bloques visuales están separados en
   subcomponentes shared / mobile / desktop bajo components/detail-v3.

   Garantía anti-desborde horizontal (X): la raíz lleva `overflow-x-clip` como
   red final (no crea scroll container, no rompe los `sticky`), los hijos de
   flex/grid que contienen texto llevan `min-w-0`, el texto dinámico de BD lleva
   `break-words`, y cada fila horizontal es un scroller `overflow-x-auto` con
   interno `w-max`. */
const ProductVersionDetailV3 = () => {
    const c = useProductVersionDetailV3Controller();

    const {
        params, navigate, data, isLoading, error, image, setImage,
        sortedImageUrls, sortedTags, certificationResources, otherResources,
        techSheetUrl, categorySlug, productIsPaused,
        reviews, reviewsLoading, reviewsResume, reviewsResumeLoading,
        galleryModalRef, pdfModalRef,
        form, addReview, selectedRating, handleSelectRating, onSubmit, hasReviewed,
        isAuth, quickSpecs, availableTabs, activeTab, setActiveTab,
        sortedParents, purchaseCardProps, similarProducts,
        reviewPage, setReviewPage,
    } = c;

    if (isLoading) return <ProductDetailSkeleton />;
    if (error || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4">
            <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center shadow-inner">
                <FaTriangleExclamation className="text-5xl text-error drop-shadow-md" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-black text-base-content mb-2">Página no encontrada</h2>
                <p className="text-base-content/60 font-medium max-w-md mx-auto break-words">Lo sentimos, no pudimos cargar la información de este producto o no existe. Por favor, verifica el enlace.</p>
            </div>
            <button type="button" className="btn btn-primary font-bold px-8 mt-2 shadow-lg" onClick={() => navigate('/')}>Ir al inicio</button>
        </div>
    );

    /* SKU y rating reutilizados: el SKU en mobile ahora es un badge sobre la imagen
       y el rating va bajo el nombre; en desktop ambos quedan en la columna de info */
    const skuBadgeBlock = <SkuBadgeBlock sku={data.sku} />;
    const ratingBlock = <RatingBlock reviewsResume={reviewsResume} />;

    return (
        <div className="w-full bg-base-100 min-h-screen pb-16 overflow-x-clip">
            {/* ══ BARRA SUPERIOR ════════════════════════════════════════════ */}
            <BreadcrumbBar
                categorySlug={categorySlug}
                categoryName={data.category.name}
                productName={data.name}
            />

            <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8 pt-5">
                {/* Título + tags + rating (mobile) */}
                <MobileTitleSection name={data.name} tags={sortedTags} ratingBlock={ratingBlock} />

                {/* Tags (solo desktop, arriba del layout como hasta ahora) */}
                <DesktopTags tags={sortedTags} />

                {/* ══ SECCIÓN PRINCIPAL ═════════════════════════════════════ */}
                {/* gap-y-2 en mobile: la PurchaseCard queda a ~mt-2 de la sección de versiones
                    (único límite de fila visible en mobile: galería → info) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-2 lg:gap-7">

                    {/* ── Galería ── */}
                    <div className="lg:col-span-5">
                        <ProductGallery
                            data={data}
                            image={image}
                            sortedImageUrls={sortedImageUrls}
                            onSelectImage={setImage}
                            galleryModalRef={galleryModalRef}
                        />

                        {/* Versiones (mobile): debajo de la sección de imágenes */}
                        <MobileVersionsRow
                            sortedParents={sortedParents}
                            currentSku={params.sku}
                            categorySlug={categorySlug}
                            productName={data.name}
                        />
                    </div>

                    {/* ── Info del producto ── */}
                    {/* min-w-0 defensivo: la columna flex se contrae en vez de expandir el grid */}
                    <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
                        <DesktopInfoHeader name={data.name} skuBadgeBlock={skuBadgeBlock} ratingBlock={ratingBlock} />

                        {/* Purchase card móvil */}
                        <MobilePurchaseBlock {...purchaseCardProps} />

                        {/* Color + ficha técnica */}
                        <ColorSpecRow color={data.color} techSheetUrl={techSheetUrl} pdfModalRef={pdfModalRef} />

                        {/* Presentaciones disponibles (solo desktop; en mobile van bajo la galería) */}
                        <DesktopVersions
                            sortedParents={sortedParents}
                            currentSku={params.sku}
                            categorySlug={categorySlug}
                            productName={data.name}
                        />

                        <QuickSpecsList specs={quickSpecs} />

                        {/* Badges de contacto (desktop) */}
                        <DesktopInfoBadges
                            productName={data.name}
                            sku={data.sku}
                            productIsPaused={productIsPaused}
                            stock={data.stock}
                        />
                    </div>

                    {/* ── Purchase Card Desktop ── */}
                    <DesktopPurchaseColumn {...purchaseCardProps} />
                </div>

                {/* Badges de contacto (móvil) */}
                <MobileContactBadges
                    productName={data.name}
                    sku={data.sku}
                    productIsPaused={productIsPaused}
                    stock={data.stock}
                />

                {/* ══ DETALLES + RECURSOS ═══════════════════════════════════ */}
                <TrustStrip />

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tabs técnicos */}
                    {/* min-w-0 defensivo: la columna flex/grid se contrae en vez de expandir */}
                    <div className="lg:col-span-7 xl:col-span-8 min-w-0">
                        <h2 className="text-xl font-black text-base-content mb-4 flex items-center gap-2.5">
                            <FaFileLines className="text-primary" /> Detalles del producto
                        </h2>
                        <DetailTabs availableTabs={availableTabs} activeTab={activeTab} onSelectTab={setActiveTab} />
                    </div>

                    {/* Ficha técnica, certificaciones y recursos */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 min-w-0">
                        <ResourcesPanel
                            techSheetUrl={techSheetUrl}
                            otherResources={otherResources}
                            certificationResources={certificationResources}
                            pdfModalRef={pdfModalRef}
                        />
                    </div>
                </div>

                {/* ══ RESEÑAS Y OPINIONES ═══════════════════════════════════ */}
                <ReviewsSection
                    reviewsResume={reviewsResume}
                    reviewsResumeLoading={reviewsResumeLoading}
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    reviewPage={reviewPage}
                    setReviewPage={setReviewPage}
                    isAuth={isAuth}
                    isReviewed={data.details.isReviewed}
                    hasReviewed={hasReviewed}
                    selectedRating={selectedRating}
                    handleSelectRating={handleSelectRating}
                    onSubmit={onSubmit}
                    form={form}
                    isAddReviewPending={addReview.isPending}
                />
            </div>

            {/* ══ PRODUCTOS SIMILARES ════════════════════════════════════ */}
            <SimilarProducts similarProducts={similarProducts} currentSku={params.sku} />

            {/* ══ MODALES ═══════════════════════════════════════════════════ */}
            <ProductVersionImageGallery
                ref={galleryModalRef}
                currentImage={image!}
                images={data.images.map(img => img.url)}
                productData={{
                    productName: data.name,
                    subcategories: [],
                    colorLine: data.color.line,
                    colorName: data.color.name,
                    colorCode: data.color.code,
                }}
            />

            <PdfViewerModal
                ref={pdfModalRef}
                url={techSheetUrl}
                title={`Ficha técnica · ${data.name}`}
            />
        </div>
    );
};

export default ProductVersionDetailV3;
