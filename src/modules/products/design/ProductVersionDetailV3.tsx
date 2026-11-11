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

/* V3 product detail page: composition only. All the logic lives in
   useProductVersionDetailV3Controller; the visual blocks are split into
   shared / mobile / desktop subcomponents under components/detail-v3.

   Horizontal overflow guarantee (X): the root uses `overflow-x-clip` as the
   final safety net (it does not create a scroll container and does not break
   the `sticky` elements), flex/grid children containing text use `min-w-0`,
   dynamic DB text uses `break-words`, and each horizontal row is an
   `overflow-x-auto` scroller with an inner `w-max`. */
const ProductVersionDetailV3 = () => {
    const c = useProductVersionDetailV3Controller();

    const {
        params, navigate, data, isLoading, error, selectedMedia, setSelectedMedia,
        sortedMedia, sortedTags, certificationResources, otherResources,
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

    /* Reused SKU and rating: on mobile the SKU is now a badge over the image
       and the rating goes below the name; on desktop both stay in the info column */
    const skuBadgeBlock = <SkuBadgeBlock sku={data.sku} />;
    const ratingBlock = <RatingBlock reviewsResume={reviewsResume} />;

    return (
        <div className="w-full bg-base-100 min-h-screen pb-16 overflow-x-clip">
            {/* ══ TOP BAR ═══════════════════════════════════════════════════ */}
            <BreadcrumbBar
                categorySlug={categorySlug}
                categoryName={data.category.name}
                productName={data.name}
            />

            <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8 pt-5">
                {/* Title + tags + rating (mobile) */}
                <MobileTitleSection name={data.name} tags={sortedTags} ratingBlock={ratingBlock} />

                {/* Tags (desktop only, above the layout as before) */}
                <DesktopTags tags={sortedTags} />

                {/* ══ MAIN SECTION ════════════════════════════════════════════ */}
                {/* gap-y-2 on mobile: the PurchaseCard stays at ~mt-2 from the versions section
                    (only visible row boundary on mobile: gallery → info) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-2 lg:gap-7">

                    {/* ── Gallery ── */}
                    <div className="lg:col-span-5">
                        <ProductGallery
                            data={data}
                            selectedMedia={selectedMedia}
                            sortedMedia={sortedMedia}
                            onSelectMedia={setSelectedMedia}
                            galleryModalRef={galleryModalRef}
                        />

                        {/* Versions (mobile): below the images section */}
                        <MobileVersionsRow
                            sortedParents={sortedParents}
                            currentSku={params.sku}
                            categorySlug={categorySlug}
                            productName={data.name}
                        />
                    </div>

                    {/* ── Product info ── */}
                    {/* Defensive min-w-0: the flex column shrinks instead of expanding the grid */}
                    <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
                        <DesktopInfoHeader name={data.name} skuBadgeBlock={skuBadgeBlock} ratingBlock={ratingBlock} />

                        {/* Purchase card (mobile) */}
                        <MobilePurchaseBlock {...purchaseCardProps} />

                        {/* Color + tech sheet */}
                        <ColorSpecRow color={data.color} techSheetUrl={techSheetUrl} pdfModalRef={pdfModalRef} />

                        {/* Available variants (desktop only; on mobile they go below the gallery) */}
                        <DesktopVersions
                            sortedParents={sortedParents}
                            currentSku={params.sku}
                            categorySlug={categorySlug}
                            productName={data.name}
                        />

                        <QuickSpecsList specs={quickSpecs} />

                        {/* Contact badges (desktop) */}
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

                {/* Contact badges (mobile) */}
                <MobileContactBadges
                    productName={data.name}
                    sku={data.sku}
                    productIsPaused={productIsPaused}
                    stock={data.stock}
                />

                {/* ══ DETAILS + RESOURCES ═════════════════════════════════════ */}
                <TrustStrip />

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Technical tabs */}
                    {/* Defensive min-w-0: the flex/grid column shrinks instead of expanding */}
                    <div className="lg:col-span-7 xl:col-span-8 min-w-0">
                        <h2 className="text-xl font-black text-base-content mb-4 flex items-center gap-2.5">
                            <FaFileLines className="text-primary" /> Detalles del producto
                        </h2>
                        <DetailTabs availableTabs={availableTabs} activeTab={activeTab} onSelectTab={setActiveTab} />
                    </div>

                    {/* Tech sheet, certifications and resources */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 min-w-0">
                        <ResourcesPanel
                            techSheetUrl={techSheetUrl}
                            otherResources={otherResources}
                            certificationResources={certificationResources}
                            pdfModalRef={pdfModalRef}
                        />
                    </div>
                </div>

                {/* ══ REVIEWS AND OPINIONS ═════════════════════════════════════ */}
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

            {/* ══ SIMILAR PRODUCTS ═════════════════════════════════════════ */}
            <SimilarProducts similarProducts={similarProducts} currentSku={params.sku} />

            {/* ══ MODALS ═════════════════════════════════════════════════════ */}
            <ProductVersionImageGallery
                ref={galleryModalRef}
                currentMedia={selectedMedia}
                media={sortedMedia}
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
