import { type RefObject, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaUser, FaLock, FaShieldAlt } from "react-icons/fa";
import type { UpdateProfileFormType } from "../CustomerTypes";
import { useAuthStore } from "../../auth/states/authStore";
import { useUpdateCustomer } from "../hooks/useCustomer";

type Props = {
    ref: RefObject<HTMLDialogElement | null>;
    onClose: () => void;
    activeModalType: 'name' | 'password' | null;
};

const UpdateProfileForm = ({ ref, onClose, activeModalType }: Props) => {
    const { authCustomer } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateCustomer = useUpdateCustomer({ type: activeModalType });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileFormType>({
        defaultValues: {
            name: authCustomer?.name,
            last_name: authCustomer?.last_name,
            email: authCustomer?.email,
        }
    });

    // Sincronizar reinicio cuando se cierra/abre
    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit: SubmitHandler<UpdateProfileFormType> = async (data) => {
        setIsSubmitting(true);
        await updateCustomer.mutateAsync({ data });
        handleClose();
        setIsSubmitting(false);

    };

    if (!activeModalType) return null;

    return (
        <dialog id="update_profile_modal" className="modal modal-bottom sm:modal-middle" ref={ref}>
            <div className="modal-box relative bg-base-100 p-6 sm:p-8 shadow-xl max-w-sm sm:max-w-md w-full">
                <form method="dialog">
                    <button type="button" onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
                </form>

                <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
                    {activeModalType === 'name' && <><FaUser className="text-primary" /> Editar Nombre</>}
                    {/* {activeModalType === 'email' && <><FaEnvelope className="text-primary" /> Editar Correo</>}
                    {activeModalType === 'phone' && <><FaPhone className="text-primary" /> Editar Teléfono</>} */}
                    {activeModalType === 'password' && <><FaLock className="text-primary" /> Cambiar Contraseña</>}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {activeModalType === 'name' && (
                        <>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Nombre</span></label>
                                <input type="text" {...register('name', { required: "Este campo es requerido" })} className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`} />
                                {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Apellidos</span></label>
                                <input type="text" {...register('last_name', { required: "Este campo es requerido" })} className={`input input-bordered w-full ${errors.last_name ? 'input-error' : ''}`} />
                                {errors.last_name && <span className="text-error text-xs mt-1">{errors.last_name.message}</span>}
                            </div>
                        </>
                    )}

                    {/* {activeModalType === 'email' && (
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Nuevo Correo Electrónico</span></label>
                            <input type="email" {...register('email', { required: "Este campo es requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })} className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} />
                            {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                        </div>
                    )}

                    {activeModalType === 'phone' && (
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold">Nuevo Teléfono</span></label>
                            <input type="tel" {...register('phone', { required: "Este campo es requerido", pattern: { value: /^[0-9]{10,15}$/, message: "Teléfono inválido" } })} className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`} />
                            {errors.phone && <span className="text-error text-xs mt-1">{errors.phone.message}</span>}
                        </div>
                    )} */}

                    {activeModalType === 'password' && (
                        <>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Nueva Contraseña</span></label>
                                <input type="password" {...register('new_password', { required: "Este campo es requerido", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} className={`input input-bordered w-full ${errors.new_password ? 'input-error' : ''}`} />
                                {errors.new_password && <span className="text-error text-xs mt-1">{errors.new_password.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Confirmar Nueva Contraseña</span></label>
                                <input type="password" {...register('confirm_password', { required: "Este campo es requerido" })} className={`input input-bordered w-full ${errors.confirm_password ? 'input-error' : ''}`} />
                                {errors.confirm_password && <span className="text-error text-xs mt-1">{errors.confirm_password.message}</span>}
                            </div>
                        </>
                    )}

                    {/* Common Security Confirmation */}
                    <div className="bg-base-200 border border-base-300 rounded-xl p-4 mt-8">
                        <p className="text-sm font-medium text-base-content flex items-center gap-2 mb-2">
                            <FaShieldAlt className="text-warning text-lg" />
                            Confirmación de seguridad
                        </p>
                        <p className="text-xs text-base-content/70 mb-3">Ingresa tu contraseña actual para autorizar estos cambios en tu cuenta.</p>
                        <div className="form-control">
                            <input type="password" placeholder="Contraseña actual" {...register('current_password', { required: "La contraseña es requerida para confirmar" })} className={`input input-bordered w-full bg-base-100 ${errors.current_password ? 'input-error' : ''}`} />
                            {errors.current_password && <span className="text-error text-xs mt-1">{errors.current_password.message}</span>}
                        </div>
                    </div>

                    <div className="modal-action mt-6 flex gap-2 flex-col sm:flex-row justify-end">
                        <button type="button" onClick={handleClose} className="btn btn-ghost w-full sm:w-auto hover:bg-base-200 order-2 sm:order-1">Cancelar</button>
                        <button type="submit" className="btn btn-primary text-white w-full sm:w-auto order-1 sm:order-2" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
                <button onClick={handleClose}>Cerrar</button>
            </form>
        </dialog>
    );
};

export default UpdateProfileForm;
