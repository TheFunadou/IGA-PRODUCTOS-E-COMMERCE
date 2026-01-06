import { useAuthStore } from "../../auth/states/authStore";


const CustomerPersonalInfo = () => {
    const { authCustomer } = useAuthStore();

    return (
        <div className="w-full animate-fade-in-up">
            <div className="w-full rounded-xl bg-white p-10">
                <p className="text-3xl font-bold">Mi cuenta</p>
                <div className="w-full flex flex-col gap-3 mt-5">
                    <div className="flex items-start justify-between bg-slate-50 border border-gray-300 w-1/4 rounded-xl p-5">
                        <div>
                            <p className="text-3xl font-bold">Nombre</p>
                            <div>
                                <p className="text-2xl font-medium">{`${authCustomer?.name.toUpperCase()} ${authCustomer?.last_name.toUpperCase()}`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>
                    <div className="flex items-start justify-between bg-slate-50 border border-gray-300 w-1/4 rounded-xl p-5">
                        <div>
                            <p className="text-3xl font-bold">Correo electronico</p>
                            <div>
                                <p className="text-2xl font-medium">{`${authCustomer?.email}`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>
                    <div className="bg-slate-50 border border-gray-300 w-1/4 rounded-xl p-5">
                        <div>
                            <p className="text-3xl font-bold">Nombre</p>
                            <div>
                                <p className="text-2xl font-medium">{`${authCustomer}`}</p>
                            </div>
                        </div>
                        <button type="button" className="underline text-primary">Editar</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomerPersonalInfo;