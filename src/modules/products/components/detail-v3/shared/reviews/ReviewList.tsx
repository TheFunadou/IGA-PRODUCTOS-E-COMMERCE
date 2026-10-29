import clsx from "clsx";
import { FaCircleUser, FaStar } from "react-icons/fa6";
import { formatDate } from "../../../../Helpers";
import PaginationComponent from "../../../../../../global/components/PaginationComponent";
import type { GetProductVersionReviewsType } from "../../../../ProductTypes";

/* Lista de reseñas con paginación, skeleton de carga y estado vacío */
interface ReviewListProps {
    reviews?: GetProductVersionReviewsType;
    reviewsLoading: boolean;
    reviewPage: number;
    setReviewPage: (p: number) => void;
}

const ReviewList = ({ reviews, reviewsLoading, reviewPage, setReviewPage }: ReviewListProps) => (
    <>
        {reviewsLoading && (
            <div className="flex flex-col gap-4">
                {[1, 2].map(i => (
                    <div key={i} className="h-28 bg-base-200 animate-pulse rounded-xl"></div>
                ))}
            </div>
        )}

        {reviews && reviews.reviews.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-base-200 p-8 text-center bg-base-100/50 flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaStar className="text-2xl text-primary opacity-50" />
                </div>
                <div>
                    <p className="text-base font-black text-base-content">Aún no hay opiniones de este producto</p>
                    <p className="text-sm font-medium text-base-content/60 mt-1">Sé el primero en probar y contarnos qué te pareció</p>
                </div>
            </div>
        )}

        {reviews && reviews.reviews.length > 0 && (
            <div className="flex flex-col gap-4">
                {reviews.reviews.map((review, i) => (
                    <div key={i} className="rounded-xl border border-base-200 bg-base-100 p-5 flex flex-col gap-3">
                        {/* min-w-0 + break-words defensivos: un nombre/título largo de BD se contrae en vez de expandir la tarjeta */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20">
                                    <FaCircleUser className="text-base" />
                                </div>
                                <div className="flex flex-col leading-tight min-w-0">
                                    <span className="text-sm font-extrabold text-base-content break-words">{review.customer}</span>
                                    <p className="text-[11px] font-bold text-base-content/40">{formatDate(review.created_at, "es-MX")}</p>
                                </div>
                            </div>
                            <div className="rating rating-sm pointer-events-none">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <div key={v} className={clsx("mask mask-star-2", v <= review.rating ? "bg-yellow-400" : "bg-base-200")} />
                                ))}
                            </div>
                        </div>
                        <div className="bg-base-200/40 p-3.5 rounded-xl">
                            <span className="text-sm font-black text-base-content block mb-1 break-words">{review.title}</span>
                            <p className="text-[13px] text-base-content/70 leading-relaxed break-words">{review.comment}</p>
                        </div>
                    </div>
                ))}
                {reviews.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <PaginationComponent
                            currentPage={reviewPage}
                            onPageChange={setReviewPage}
                            totalPages={reviews.totalPages}
                        />
                    </div>
                )}
            </div>
        )}
    </>
);

export default ReviewList;
