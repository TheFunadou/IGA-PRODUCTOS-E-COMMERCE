import IGALogo from "../../../assets/logo/IGA-LOGO.webp"

const CreateAccount = () => {
    return (
        <div className="animate-fade-in-up flex item-center justify-center">
            <div className="w-70/100 bg-white rounded-xl shadow-lg px-5 py-10 flex items-start ">
                <div className="w-75/100 pr-5">
                    <figure className="bg-blue-950 rounded-xl p-5">
                        <img src={IGALogo} alt="" />
                    </figure>

                </div>
                <div className="w-35/100 px-5 border-l border-l-gray-300">
                    <p className="text-3xl font-bold">Crear nueva cuenta</p>
                    <form className="w-full flex flex-col gap-5 mt-5 text-lg [&_input]:w-full">
                        <div>
                            <p>Nombre:</p>
                            <input type="text" className="input" placeholder="Nombre" />
                        </div>
                        <div>
                            <p>Apellidos:</p>
                            <input type="text" className="input" placeholder="Apellidos" />
                        </div>
                        <div>
                            <p>Correo electronico:</p>
                            <input type="email" className="input" placeholder="Nombre" />
                        </div>
                        <div>
                            <p>Confirma tu correo electronico:</p>
                            <input type="email" className="input" placeholder="Nombre" />
                        </div>
                        <div>
                            <p>Contraseña:</p>
                            <input type="password" className="input" placeholder="Nombre" />
                        </div>
                        <div>
                            <p>Confirmar contraseña:</p>
                            <input type="password" className="input" placeholder="Nombre" />
                        </div>
                        <button type="submit" className="btn btn-primary w-full text-lg">Crear cuenta</button>
                        <p className="text-sm text-gray-500">Al crear una cuenta en Iga Productos estas aceptando los <span className="underline">terminos y condiciones</span></p>
                    </form>

                </div>
            </div>

        </div>
    );
};

export default CreateAccount;