import { Link } from "react-router-dom";
import clsx from "clsx";
import { FaCircleUser } from "react-icons/fa6";
import type { AddPVReviewType } from "../../../../ProductTypes";
import type { UseFormReturn } from "react-hook-form";

/* Formulario de nueva reseña (requiere sesión) + estado "inicia sesión" */
interface ReviewFormProps {
    isAuth: boolean;
    isReviewed: boolean;
    hasReviewed: boolean;
    selectedRating: number;
    handleSelectRating: (v: number) => void;
    onSubmit: (formData: AddPVReviewType) => Promise<void>;
    form: UseFormReturn<AddPVReviewType>;
    isAddReviewPending: boolean;
}

const ReviewForm = ({
    isAuth, isReviewed, hasReviewed,
    selectedRating, handleSelectRating, onSubmit,
    form, isAddReviewPending
}: ReviewFormProps) => {
    const {
        register, handleSubmit,
        formState: { errors: formErrors, isSubmitting },
        watch
    } = form;
    const reviewTitle = watch("title");
    const reviewComment = watch("comment");

    return (
        <div className="mt-6">
            {isAuth && !isReviewed && !hasReviewed && (
                <div className="rounded-xl bg-base-100 border border-base-200 p-6">
                    <div className="mb-5">
                        <h3 className="text-lg font-black text-base-content">Escribir una opinión</h3>
                        <p className="text-xs text-base-content/60 font-medium mt-0.5">Comparte tu experiencia para ayudar a otros clientes</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <div className="bg-base-200/40 p-4 rounded-xl border border-base-200 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                            <div className="flex flex-col gap-0.5">
                                <label className="text-xs font-bold text-base-content uppercase tracking-wider">¿Cómo calificarías este producto?</label>
                                <p className="text-[11px] text-base-content/50">1 estrella = Malo, 5 estrellas = Excelente</p>
                            </div>
                            <div className="rating rating-lg">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <input key={v} type="radio" name="rating-form-v3"
                                        className="mask mask-star-2 bg-yellow-400 hover:scale-110 transition-transform"
                                        aria-label={`${v} estrellas`}
                                        onChange={() => handleSelectRating(v)}
                                        checked={selectedRating === v}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="review-title-v3" className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest block mb-1 ml-0.5">Título de tu reseña</label>
                                <input
                                    id="review-title-v3"
                                    {...register("title", { required: "Este campo es obligatorio", maxLength: { value: 50, message: "Máximo 50 caracteres" } })}
                                    type="text"
                                    className="input input-bordered input-sm w-full font-semibold focus:ring-2 focus:ring-primary/20"
                                    placeholder="Ej: Excelente calidad, justo lo que buscaba"
                                />
                                <div className={clsx("flex mt-1 text-[11px] font-bold px-0.5", formErrors.title ? "justify-between" : "justify-end")}>
                                    {formErrors.title && <p className="text-error">{formErrors.title.message}</p>}
                                    <p className={clsx(reviewTitle?.length > 50 && "text-error", "text-base-content/40")}>{reviewTitle?.length ?? 0}/50</p>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="review-comment-v3" className="text-[11px] font-bold text-base-content/55 uppercase tracking-widest block mb-1 ml-0.5">Cuéntanos más detalles</label>
                                <textarea
                                    id="review-comment-v3"
                                    {...register("comment", { required: "Este campo es obligatorio", maxLength: { value: 300, message: "Máximo 300 caracteres" } })}
                                    className="textarea textarea-bordered w-full text-sm py-2.5 resize-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="¿Qué te gustó más? ¿Cómo ha sido el rendimiento?" rows={4}
                                />
                                <div className={clsx("flex mt-1 text-[11px] font-bold px-0.5", formErrors.comment ? "justify-between" : "justify-end")}>
                                    {formErrors.comment && <p className="text-error">{formErrors.comment.message}</p>}
                                    <p className={clsx(reviewComment?.length > 300 && "text-error", "text-base-content/40")}>{reviewComment?.length ?? 0}/300</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={isAddReviewPending || isSubmitting} className="btn btn-primary btn-sm px-8 font-black uppercase tracking-wider rounded-lg shadow-md shadow-primary/20">
                                {isAddReviewPending ? "Publicando..." : "Publicar opinión"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!isAuth && (
                <div className="rounded-xl bg-base-200/40 border border-base-200 p-6 text-center flex flex-col items-center justify-center h-44">
                    <div className="bg-base-100 p-3 rounded-full shadow-sm mb-2.5">
                        <FaCircleUser className="text-2xl text-primary" />
                    </div>
                    <p className="text-base font-black text-base-content mb-0.5">Inicia sesión para opinar</p>
                    <p className="text-xs font-medium text-base-content/60 mb-3">
                        Solo los usuarios registrados pueden dejar reseñas de productos.
                    </p>
                    <Link to="/nueva-cuenta" className="btn btn-primary btn-sm px-6 rounded-full font-bold">
                        Crear cuenta o entrar
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ReviewForm;
