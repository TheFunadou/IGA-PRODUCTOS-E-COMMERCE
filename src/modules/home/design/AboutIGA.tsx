import HeaderIMG from "../../../assets/headers/IMG-1.png"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import { FaSearch } from "react-icons/fa";
import { PiBinocularsDuotone } from "react-icons/pi";
import { IoDiamond } from "react-icons/io5";

const AboutIGA = () => {
    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                <div className="px-60 py-15 flex text-white rounded-xl bg-right" style={{ backgroundImage: `url(${HeaderIMG})` }}>
                    <div className="w-1/2">
                        <p className="text-3xl font-bold">Acerca de IGA</p>
                        <section className="text-lg/8 text-justify mt-5">
                            <p>
                                <strong>Plásticos del Golfo-Sur, S.A. de C.V.</strong> Es una empresa 100% mexicana, certificada bajo la norma ISO 9001:2015; especializada en la producción, comercialización y distribución de lentes, barboquejos y cascos de seguridad industrial.
                            </p>
                            <br />
                            <p>
                                Inició sus actividades el 8 de marzo de 1999, en Coatzacoalcos, Veracruz, como una empresa dedicada a la transformación por inyección de plásticos y su comercialización, cuyo primer proceso fue la fabricación de palillos con hilo dental integrado.
                            </p>
                            <br />
                            <p>
                                En el 2003 incursionó en el área de seguridad personal, con la producción de dos líneas específicas: cascos y lentes de seguridad, en varios modelos. Los cascos se elaboran y comercializan bajo la marca registrada IGA.
                            </p>
                        </section>
                    </div>
                    <div className="w-1/2  flex items-end">
                        <figure className="ml-10 w-3/4">
                            <img src={IGALogo} alt="IGA productos Logo" />
                        </figure>
                    </div>
                </div>
                <div className="w-full mt-5">
                    <h3 className="text-4xl font-bold text-center">Nuestros principios</h3>

                    <div className="w-full flex justify-center mt-10 [&_div]:text-center [&_div]:text-4xl [&_div]:font-bold">
                        <div className="flex-1 px-10">
                            <p className="bg-primary rounded-3xl text-white py-2 flex justify-center gap-2"><FaSearch/>MISIÓN</p>
                            <p className="text-lg/8 font-normal text-justify mt-3">
                                Proporcionar a los clientes productos de protección personal que cumplan con las normas mexicanas para su uso, y procesos de fabricación por inyección; así como la extrusión soplo de envases, brindando asesoramiento de los mismos, manteniendo una rentabilidad creciente y sostenible en los procesos, basados en el sistema de gestión de calidad propiciando la mejora continua de los mismos.
                            </p>
                        </div>
                        <div className="flex-1 px-10">
                            <p className="bg-primary text-white py-2 rounded-3xl flex justify-center gap-2"><PiBinocularsDuotone/>VISIÓN</p>
                            <p className="text-lg/8 font-normal text-justify mt-3">
                                Ser una empresa líder en la fabricación y comercialización de equipos de protección personal; desarrollando proyectos innovadores en envases y contenedores que cumplan con normas internacionales que contribuyan con el medio ambiente, a través de productos reciclables y biodegradables.
                            </p>
                        </div>
                        <div className="flex-1 px-10">
                            <p className="bg-primary  text-white py-2 rounded-3xl flex justify-center gap-2 "><IoDiamond/>VALOR</p>
                            <p className="text-lg/8 font-normal text-justify mt-3">
                                Nuestro principal valor como empresa, es proteger nuestros cascos IGA el capital intelectual de tu equipo de trabajo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutIGA;