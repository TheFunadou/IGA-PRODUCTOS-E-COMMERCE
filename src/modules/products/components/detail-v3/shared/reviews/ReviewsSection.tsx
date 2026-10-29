import { FaStar } from "react-icons/fa6";
import ReviewSummary from "./ReviewSummary";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import type { AddPVReviewType, GetProductVersionReviewsType, PVReviewResumeType } from "../../../../ProductTypes";
import type { UseFormReturn } from "react-hook-form";

/* Sección completa de "Opiniones de nuestros clientes": resumen pegajoso a la
   izquierda + lista y formulario a la derecha. */
interface ReviewsSectionProps {
    reviewsResume?: PVReviewResumeType;
    reviewsResumeLoading: boolean;
    reviews?: GetProductVersionReviewsType;
    reviewsLoading: boolean;
    reviewPage: number;
    setReviewPage: (p: number) => void;
    isAuth: boolean;
    isReviewed: boolean;
    hasReviewed: boolean;
    selectedRating: number;
    handleSelectRating: (v: number) => void;
    onSubmit: (formData: AddPVReviewType) => Promise<void>;
    form: UseFormReturn<AddPVReviewType>;
    isAddReviewPending: boolean;
}

const ReviewsSection = ({
    reviewsResume, reviewsResumeLoading,
    reviews, reviewsLoading, reviewPage, setReviewPage,
    isAuth, isReviewed, hasReviewed,
    selectedRating, handleSelectRating, onSubmit, form, isAddReviewPending
}: ReviewsSectionProps) => (
    <div className="mt-10 mb-14 scroll-mt-24" id="reseñas">
        <h2 className="text-2xl font-black text-base-content mb-6 flex items-center gap-2.5">
            <FaStar className="text-yellow-400" /> Opiniones de nuestros clientes
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Resumen */}
            <div className="w-full lg:w-[280px] shrink-0">
                <ReviewSummary reviewsResume={reviewsResume} reviewsResumeLoading={reviewsResumeLoading} />
            </div>

            {/* Lista + formulario */}
            <div className="flex-1 min-w-0">
                <ReviewList
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    reviewPage={reviewPage}
                    setReviewPage={setReviewPage}
                />
                <ReviewForm
                    isAuth={isAuth}
                    isReviewed={isReviewed}
                    hasReviewed={hasReviewed}
                    selectedRating={selectedRating}
                    handleSelectRating={handleSelectRating}
                    onSubmit={onSubmit}
                    form={form}
                    isAddReviewPending={isAddReviewPending}
                />
            </div>
        </div>
    </div>
);

export default ReviewsSection;
