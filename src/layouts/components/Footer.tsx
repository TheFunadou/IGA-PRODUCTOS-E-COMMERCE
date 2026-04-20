import { Link } from "react-router-dom";
import { FaFacebook, FaWhatsapp, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { IoArrowUp } from "react-icons/io5";
import PlasticosDelGolfoLogo from "../../assets/logo/plasticos-del-golfo.webp";

const Footer = () => {

    const smoothScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            <footer className="w-full bg-blue-950 text-white mt-auto">
                {/* Back to Top Bar */}
                <div className="w-full border-b border-white/10 hover:bg-white/5 transition-colors duration-300">
                    <a
                        href="#top"
                        onClick={smoothScrollToTop}
                        className="w-full py-4 flex gap-3 text-xs md:text-sm font-bold uppercase tracking-[0.2em] items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        Volver al inicio <IoArrowUp className="text-lg md:text-xl" />
                    </a>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
                    {/* Rutas: Hidden on Mobile, Grid on Desktop */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-16 mb-12 lg:mb-16">

                        <div className="flex flex-col gap-5">
                            <h3 className="text-lg font-black uppercase tracking-wider">Conócenos</h3>
                            <ul className="flex flex-col gap-3 text-sm font-medium opacity-70 [&_a:hover]:opacity-100 [&_a]:transition-opacity">
                                <li><Link to={"/acerca-de-iga"}>Acerca de Nosotros</Link></li>
                                <li><Link to={"/contacto"}>Contacto</Link></li>
                                <li><Link to={"/distribuidores"}>Distribuidores</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="text-lg font-black uppercase tracking-wider">Servicio al Cliente</h3>
                            <ul className="flex flex-col gap-3 text-sm font-medium opacity-70 [&_a:hover]:opacity-100 [&_a]:transition-opacity">
                                <li><Link to={"/preguntas-frecuentes"}>Preguntas Frecuentes</Link></li>
                                <li><a href="mailto:atencionacliente@igaproductos.com.mx" target="_blank" rel="noreferrer">Soporte a Compras</a></li>
                                <li><a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank" rel="noreferrer">Asesoría con Expertos</a></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="text-lg font-black uppercase tracking-wider">Políticas</h3>
                            <ul className="flex flex-col gap-3 text-sm font-medium opacity-70 [&_a:hover]:opacity-100 [&_a]:transition-opacity">
                                <li><Link to={"/politica-de-privacidad"}>Política de Privacidad</Link></li>
                                <li><Link to={"/politica-de-devolucion"}>Política de Devolución</Link></li>
                                <li><Link to={"/terminos-y-condiciones"}>Términos y Condiciones</Link></li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-5">
                            <h3 className="text-lg font-black uppercase tracking-wider">Síguenos</h3>
                            <p className="text-sm font-medium opacity-70 max-w-[200px] leading-relaxed">
                                Mantente informado sobre nuestras nuevas líneas y promociones.
                            </p>
                            <div className="flex gap-4 mt-1">
                                <a href="https://www.facebook.com/Cascos.Iga" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:scale-110 transition-all duration-300">
                                    <FaFacebook className="text-lg" />
                                </a>
                                <a href="https://www.instagram.com/iga_cascos/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] hover:scale-110 transition-all duration-300">
                                    <FaInstagram className="text-lg" />
                                </a>
                                <a href="https://x.com/iga_productos?s=20" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-black hover:scale-110 transition-all duration-300">
                                    <FaXTwitter className="text-lg" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Divisor Desktop */}
                    <div className="hidden md:block w-full border-t border-white/10 my-8"></div>

                    {/* Footer Bottom: Logo & Copyright */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

                        <div className="w-40 md:w-48 lg:w-56 opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
                            <img src={PlasticosDelGolfoLogo} alt="Logo Plásticos del Golfo Sur" className="w-full h-auto object-contain" />
                        </div>

                        <div className="flex flex-col gap-2 opacity-60 text-xs md:text-sm font-medium">
                            <p>Plásticos del Golfo Sur - Todos los derechos reservados &copy; {new Date().getFullYear()}</p>
                            <div className="flex flex-col md:flex-row justify-center md:justify-end gap-2 md:gap-4 md:items-center">
                                <span className="hidden md:inline">•</span>
                                <Link to={"/terminos-y-condiciones"} className="hover:text-white transition-colors">Términos de Servicio</Link>
                            </div>
                        </div>

                        {/* Mobile Socials (Only appears if explicitly wanted, otherwise hiding it to keep it hyper clean. Added just in case for mobile access) */}
                        <div className="md:hidden flex gap-4 mt-2">
                            <a href="https://www.facebook.com/Cascos.Iga" target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 p-2">
                                <FaFacebook className="text-2xl" />
                            </a>
                            <a href="https://www.instagram.com/iga_cascos/" target="_blank" rel="noreferrer" className="opacity-60 hover:opacity-100 p-2">
                                <FaInstagram className="text-2xl" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Sticky Whatsapp Fab (Escondido en móvil por diseño original o en tablet si lo requieren. Lo mantenemos igual) */}
            <div
                className="hidden md:flex fixed bottom-6 right-0 text-white bg-success hover:bg-green-600 shadow-xl shadow-success/30 rounded-l-2xl p-4 z-[1000] tooltip tooltip-left items-center justify-center hover:-translate-x-1 transition-all duration-300 cursor-pointer"
                data-tip="Contáctanos por WhatsApp"
            >
                <a href="https://api.whatsapp.com/send?phone=529211963246" target="_blank" rel="noreferrer">
                    <FaWhatsapp className="w-7 h-7" />
                </a>
            </div>
        </>
    );
};

export default Footer;