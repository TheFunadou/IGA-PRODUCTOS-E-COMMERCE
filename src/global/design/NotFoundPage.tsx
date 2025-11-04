import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="w-full min-h-screen bg-slate-900 flex flex-col">
            <nav className="w-full flex justify-end items-center text-white text-lg underline p-5">
                <Link to="/">Volver al inicio</Link>
            </nav>

            <div className="flex-1 w-full flex flex-col gap-5 items-center justify-center">
                <figure>
                    <img src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/igaproductos.png" alt="Logo Iga Productos" />
                </figure>
                <p className="text-4xl font-bold text-white">Ocurrió un error inesperado</p>
            </div>
        </div>

    );
};

export default NotFoundPage;