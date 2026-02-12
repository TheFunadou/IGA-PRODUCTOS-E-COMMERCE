import { FaKey, FaLock, FaPhone, FaUser } from "react-icons/fa6";
import { useAuthStore } from "../../auth/states/authStore";
import { FaMailBulk } from "react-icons/fa";


const CustomerPersonalInfo = () => {
    const { authCustomer } = useAuthStore();

    return (
        <div className="w-1/4 animate-fade-in-up">
            <div className="w-full rounded-xl bg-base-100 p-10">
                <p className="text-3xl font-bold">Mi cuenta</p>
                <div className="w-full flex flex-col gap-3 mt-5">
                    <div className="flex items-start justify-between bg-slate-50 border border-gray-300 w-full rounded-xl p-5">
                        <div>
                            <p className="text-xl font-bold flex items-center gap-2"><FaUser size={20} />Nombre</p>
                            <div>
                                <p className="text-xl font-medium">{`${authCustomer && authCustomer.name} ${authCustomer && authCustomer.last_name}`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>
                    <div className="flex items-start justify-between bg-slate-50 border border-gray-300 w-full rounded-xl p-5">
                        <div>
                            <p className="text-xl font-bold flex items-center gap-2"><FaPhone size={20} />Número telefonico</p>
                            <div>
                                <p className="text-xl font-medium">{`92114436595`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>
                    <div className="flex items-start justify-between bg-slate-50 border border-gray-300 w-full rounded-xl p-5">
                        <div>
                            <p className="text-xl font-bold flex items-center gap-2"><FaMailBulk size={20} />Correo electronico</p>
                            <div>
                                <p className="text-xl font-medium">{`${authCustomer && authCustomer.email}`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>

                    <div className="bg-slate-50 border border-gray-300 w-full rounded-xl p-5">
                        <div>
                            <p className="text-xl font-bold flex items-center gap-2"><FaLock size={20} />Seguridad</p>
                            <div className="mt-2 flex flex-col gap-3 w-full">
                                <button className="w-full btn "><FaKey />Cambiar contraseña</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

};

export default CustomerPersonalInfo;