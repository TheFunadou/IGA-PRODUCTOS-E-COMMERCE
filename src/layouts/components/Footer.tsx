import { Link } from "react-router-dom";
import { FaFacebook, FaWhatsapp } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoArrowUp } from "react-icons/io5";
import PlasticosDelGolfoLogo from "../../assets/logo/plasticos-del-golfo.webp"

const Footer = () => {
    return (
        <>
            <div className="w-full bg-blue-900 text-center text-white py-3 flex items-center justify-center">
                <a href="#top" className="flex gap-2 text-xl items-center">Ir al inicio<IoArrowUp /></a>
            </div>
            <footer className="w-full bg-blue-950 px-5 py-10 text-white">
                <div className="hidden md:flex w-full items-start justify-center gap-10 xl:gap-20 [&_ul]:mt-2 [&_li]:list-disc [&_li]:ml-2">
                    <div>
                        <p className="text-3xl font-bold">Conocenos</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"/acerca-de-iga"}>Acerca de Nosotros</Link></li>
                            <li><Link to={"/contacto"}>Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">FAQ´s</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"/preguntas-frecuentes"}>Preguntas frecuentes</Link></li>
                            <li><a href="mailto:atencionacliente@igaproductos.com.mx" type="email" target="_blank">Soporte a compras</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">Legal</p>
                        <ul className="flex flex-col gap-5">
                            <li><Link to={"/politica-de-privacidad"}>Politica de privacidad</Link></li>
                            <li><Link to={"/politica-de-devolucion"}>Politica de devolución</Link></li>
                            <li><Link to={"/terminos-y-condiciones"}>Términos y condiciones</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">Conocenos</p>
                        <ul className="flex flex-col gap-5">
                            <li><a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank">Contacta a un experto</a></li>
                            <li><Link to={"/distribuidores"}>Distribuidores</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between">
                    <figure className="w-50/100 md:w-20/100">
                        <img src={PlasticosDelGolfoLogo} alt="Logo Plasticos del Golfo Sur" />
                    </figure>
                    <div className="w-50/100 md:w-60/100 text-sm md:text-base flex flex-col text-center">
                        <Link to={"/terminos-y-condiciones"} className="hover:underline">Términos y condiciones de uso</Link>
                        <p>{new Date().getFullYear()}@ Todos los Derechos Reservados</p>
                    </div>
                    <div className="hidden md:flex w-20/100 flex-col text-center">
                        <p className="font-bold">Redes sociales</p>
                        <div className="w-full flex justify-center items-center gap-3">
                            <a href="https://www.facebook.com/Cascos.Iga" target="_blank"><FaFacebook className="text-5xl hover:scale-110 duration-250" /></a>
                            <a href="https://www.instagram.com/iga_cascos/" target="_blank"><FaInstagramSquare className="text-5xl hover:scale-110 duration-250" /></a>
                            <a href="https://x.com/iga_productos?s=20" target="_blank"><FaSquareXTwitter className="text-5xl hover:scale-110 duration-250" /></a>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="hidden md:flex fixed bottom-2 right-0 text-5xl hover:scale-110 duration-250 bg-success rounded-l-md p-2 w-18 z-1000 tooltip tooltip-left items-center justify-center" data-tip="Contactanos por whatsapp">
                <a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank"><FaWhatsapp className="w-8 h-8" /></a>
            </div>
        </>
    );
};

export default Footer;