import { useEffect, useRef, useState } from "react";
import { FaLock, FaUser, FaShieldAlt, FaIdCard, FaEnvelope } from "react-icons/fa";
import { useAuthStore } from "../../auth/states/authStore";
import UpdateProfileForm from "../components/UpdateProfileForm";
import { closeModal, showModal } from "../../../global/GlobalHelpers";

export type ModalProfileFormType = 'name' | 'password' | null;

const CustomerPersonalInfo = () => {
    document.title = "Iga Productos | Mi información personal";
    const { authCustomer } = useAuthStore();
    const updateProfileModalRef = useRef<HTMLDialogElement>(null);
    const [activeModalType, setActiveModalType] = useState<ModalProfileFormType>(null);



    const handleCloseModal = () => {
        setActiveModalType(null);
        closeModal(updateProfileModalRef.current);
    };

    useEffect(() => { showModal(updateProfileModalRef.current); }, [activeModalType]);

    return (
        <div className="w-full bg-base-300 py-5 rounded-xl px-4 sm:px-6">
            <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                        <FaIdCard className="text-primary" /> Mi Cuenta
                    </h1>
                    <p className="text-sm sm:text-base text-base-content/70 mt-1">Gestiona tu información personal y la seguridad de tu cuenta.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Summary & Quick Stats */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl sm:text-2xl font-bold uppercase">
                                    {authCustomer?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg sm:text-xl font-bold capitalize truncate">
                                        {authCustomer?.name} {authCustomer?.last_name}
                                    </h2>
                                    <p className="text-sm text-base-content/70">Cliente IGA</p>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-base-300 pt-6">
                                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-base-content/50 mb-4">Resumen de Actividad</h3>
                                {/* <div className="flex items-center justify-between mb-3 text-sm sm:text-base">
                                    <span className="flex items-center gap-2 text-base-content/80"><FaBoxOpen /> Compras Totales</span>
                                    <span className="font-bold">30</span>
                                </div> */}
                                <div className="flex items-center justify-between mt-3 text-sm sm:text-base">
                                    <span className="flex items-center gap-2 text-base-content/80"><FaShieldAlt /> Nivel de Cuenta</span>
                                    <span className="font-bold text-success">Verificado</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold mb-2">¿Necesitas ayuda?</h3>
                            <p className="text-sm text-base-content/70 mb-4">Si tienes problemas con tu cuenta, contacta a nuestro equipo de soporte oportunamente.</p>
                            <button
                                className="btn btn-outline w-full btn-sm text-primary border-primary hover:bg-primary hover:text-white hover:border-transparent">
                                <a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank">Contactar Soporte</a>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Editable Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-base-300 flex justify-between items-center bg-base-100/50">
                                <h2 className="text-lg sm:text-xl font-bold">Información Personal</h2>
                            </div>

                            <div className="divide-y divide-base-300">
                                {/* Name */}
                                <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4 hover:bg-base-200/50 transition-colors">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-semibold text-base-content/60 flex items-center gap-2 mb-1"><FaUser className="shrink-0" /> Nombre completo</p>
                                        <p className="text-base sm:text-lg font-medium capitalize truncate">{authCustomer?.name} {authCustomer?.last_name}</p>
                                    </div>
                                    {/* <button onClick={() => openModal('name')} className="btn btn-sm sm:btn-md btn-ghost text-primary hover:bg-primary/10 shrink-0">Editar</button> */}
                                </div>

                                {/* Email */}
                                <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4 hover:bg-base-200/50 transition-colors">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-semibold text-base-content/60 flex items-center gap-2 mb-1"><FaEnvelope className="shrink-0" /> Correo electrónico</p>
                                        <p className="text-base sm:text-lg font-medium truncate">{authCustomer?.email}</p>
                                    </div>
                                </div>

                                {/* Phone
                                <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4 hover:bg-base-200/50 transition-colors">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm font-semibold text-base-content/60 flex items-center gap-2 mb-1"><FaPhone className="shrink-0" /> Teléfono</p>
                                        <p className="text-base sm:text-lg font-medium truncate">xx xxx xxx xxxx</p>
                                    </div>
                                    <button onClick={() => openModal('phone')} className="btn btn-sm sm:btn-md btn-ghost text-primary hover:bg-primary/10 shrink-0">Editar</button>
                                </div> */}
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 sm:p-6 border-b border-base-300 bg-base-100/50">
                                <h2 className="text-lg sm:text-xl font-bold">Seguridad</h2>
                            </div>
                            <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4 hover:bg-base-200/50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-semibold text-base-content/60 flex items-center gap-2 mb-1"><FaLock className="shrink-0" /> Contraseña</p>
                                    <p className="text-base sm:text-lg font-medium truncate">••••••••••••</p>
                                </div>
                                {/* <button onClick={() => openModal('password')} className="btn btn-sm sm:btn-md btn-ghost text-primary hover:bg-primary/10 shrink-0">Cambiar</button> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Component */}
                <UpdateProfileForm
                    ref={updateProfileModalRef}
                    onClose={handleCloseModal}
                    activeModalType={activeModalType}
                />
            </div>
        </div>
    );
};

export default CustomerPersonalInfo;