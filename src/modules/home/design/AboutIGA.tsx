import Header1 from "../../../assets/headers/HEADER_1.webp"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import { BiCertification, BiTargetLock } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useState } from "react";
import { TbDeviceVisionPro } from "react-icons/tb";
import clsx from "clsx";
import { IoDiamond } from "react-icons/io5";
import { TiWorld } from "react-icons/ti";
import { SiGooglecolab } from "react-icons/si";


const AboutIGA = () => {
    const [select, setSelect] = useState<"mision" | "vision" | "policy" | "value">("mision");
    const cfeLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Comisi%C3%B3n_Federal_de_Electricidad_%28logo%29_.svg/2560px-Comisi%C3%B3n_Federal_de_Electricidad_%28logo%29_.svg.png";
    const pemexLogo = "https://upload.wikimedia.org/wikipedia/commons/9/99/Logo_Petr%C3%B3leos_Mexicanos.svg";
    const asaLogo = "https://www.gob.mx/cms/uploads/image/file/917560/ASA_COLOR.png";
    const principles = {
        mision: {
            title: "Misión",
            description: "Proporcionar a los clientes productos de protección personal que cumplan con las normas mexicanas para su uso, y procesos de fabricación por inyección; así como la extrusión soplo de envases, brindando asesoramiento de los mismos, manteniendo una rentabilidad creciente y sostenible en los procesos, basados en el sistema de gestión de calidad propiciando la mejora continua de los mismos.",
            icon: <BiTargetLock />
        },
        vision: {
            title: "Visión",
            description: "Ser una empresa líder en la fabricación y comercialización de equipos de protección personal; desarrollando proyectos innovadores en envases y contenedores que cumplan con normas internacionales que contribuyan con el medio ambiente, a través de productos reciclables y biodegradables.",
            icon: <TbDeviceVisionPro />
        },
        policy: {
            title: "Politica de Calidad",
            description: "PLÁSTICOS DEL GOLFO SUR es una organización de la transformación de polímeros dedicada al proceso de inyección y/o extrusión soplo que garantiza la calidad de los productos dando cumplimiento a las especificaciones y normativas vigentes, asegurando la satisfacción de los clientes; aplicando la mejora continua a través de la participación de todos sus colaboradores, para incrementar el valor agregado de nuestra organización, a través de la implementación de un sistema de gestión de calidad basado en la norma internacional ISO 9001:2015.",
            icon: <BiCertification />
        },
        value: {
            title: "Valor",
            description: "IGA es una empresa que se compromete a brindar productos de calidad, innovación y sostenibilidad, manteniendo un alto nivel de servicio al cliente y comprometida con el desarrollo sostenible.",
            icon: <IoDiamond />
        },
    };

    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                <div className="px-60 py-15 flex text-white rounded-xl bg-right" style={{ backgroundImage: `url(${Header1})` }}>
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
                    <h3 className="text-4xl font-bold">Nuestros principios</h3>
                    <div className="mt-5 flex">
                        <div className="w-1/2 p-5 mr-5 bg-white rounded-xl">
                            <p className="text-lg">Da clic en cada uno de los principios para obtener más información</p>
                            <div className="flex flex-col gap-5 mt-3 [&_button]:flex [&_button]:items-center [&_button]:gap-2 [&_button]:cursor-pointer [&_button]:text-2xl [&_button]:font-medium">
                                <button
                                    className={clsx(select === "mision" && "text-primary")}
                                    onClick={() => setSelect("mision")}>
                                    Misión<MdKeyboardArrowRight />
                                </button>
                                <button
                                    className={clsx(select === "vision" && "text-primary")}
                                    onClick={() => setSelect("vision")}>
                                    Visión<MdKeyboardArrowRight />
                                </button>
                                <button
                                    className={clsx(select === "policy" && "text-primary")}
                                    onClick={() => setSelect("policy")}>
                                    Politica de Calidad<MdKeyboardArrowRight />
                                </button>
                                <button
                                    className={clsx(select === "value" && "text-primary")}
                                    onClick={() => setSelect("value")}>
                                    Valor<MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                        <div className="w-1/2 ml-5 bg-slate-900 rounded-xl px-20 py-5">
                            <p className="text-3xl font-bold text-white flex items-center gap-2">{principles[select].title}{principles[select].icon}</p>
                            <p className="text-xl/7 text-white text-justify mt-3">{principles[select].description}</p>
                        </div>
                    </div>

                </div>
                <div className="w-full mt-5">
                    <h3 className="text-4xl font-bold">Historia</h3>
                    <p className="text-base font-light">
                        FABRICAMOS UNA VARIEDAD DE PRODUCTOS DE SEGURIDAD INDUSTRIAL
                        APLICANDO ANÁLISIS, INNOVACIÓN, NORMALIZACIÓN Y CERTIFICACIÓN EN
                        PROCESOS DE INYECCIÓN DE PLÁSTICOS
                    </p>
                    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-5">
                        <li>
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-xl font-bold">1999</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-5 text-justify">
                                    PLÁSTICOS DEL GOLFO SUR S.A. DE CV. como Asociación Civil se involucra en la transformación y comercialización de productos mediante el proceso de inyección de plásticos.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-xl font-bold">2003</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-5 text-justify">
                                    Incursionamos en el área de seguridad personal, fabricando dos líneas específicas; cascos y lentes de seguridad en varios modelos. Producidos bajo los más altos estándares de calidad en cumplimiento con las Normas: NOM-115-STPS-1994, NMX-S-055-SCF1-2002 y ANSI/ISEA Z891-199.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-xl font-bold">2009</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-5 text-justify">
                                    Implementamos una serie de equipos de producción de primera calidad para lograr ahorros energéticos substanciales y una mejor operación de inyección.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-xl font-bold">2014-2020</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-5 text-justify">
                                    Certificación al proceso Normativos de nuestros cascos de seguridad industrial en las siguientes Normas: NOM-115-STPS-2009, NMX-S-055-SCFI-2002, ANSI/ISEA Z89.1-2014 (R2019), PEMEX-EST-SS-058-2018 y CFE: 8H 341-02.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-xl font-bold">2017</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-2 text-justify">
                                    Plásticos obtiene la presidencia del subcomité de equipos de protección a la cabeza del comité técnico de normalización nacional para productos de protección y seguridad. Su participación se destaca en el análisis normativo de NMX-S-055 y la norma internacional ISO para equipos de protección a la cabeza.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-end md:mb-10">
                                <time className="text-xl font-bold">2018</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-2 text-justify">
                                    Se obtiene la certificación ISO 9001-2015, alcance que comprende las actividades de: fabricación de cascos de protección personal, lentes de cascos de protección personal, lentes de seguridad y barbiquejos, actividades de ensamble e inyección.
                                </div>
                            </div>
                            <hr className="bg-primary" />
                        </li>
                        <li>
                            <hr className="bg-primary" />
                            <div className="timeline-middle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 text-primary"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="timeline-start mb-10 md:text-end">
                                <time className="text-xl font-bold">2021</time>
                                <div className="text-lg mt-2 bg-white rounded-xl px-10 py-2 text-justify">
                                    Plásticos del Golfo Sur obtiene el certificado ANSI/ISEA Z89.1 2014 (R2019) para el casco Plagosur C en ajuste de matraca tipo I, Forma II en clase "E".
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="flex">
                    <div className="w-1/2">
                        <p className="text-3xl font-bold">Servicios al Cliente</p>
                        <p className="text-xl text-medium flex items-center gap-2"><TiWorld className="text-primary" />Nacional e internacional</p>
                        <ul className="w-90/100 text-justify list-disc list-inside text-xl flex flex-col gap-5 mt-5">
                            <li>Ofrecemos a nuestros clientes servicio de maquila de inyección en plásticos, contando con la experiencia, equipo y maquinaria para el proceso de materiales termoplásticos y resinas de ingeniería.</li>
                            <li>Capacidad instalada en maquinas de inyección de 35 a 320 toneladas de cierre.</li>
                            <li>Contamos con equipo periférico para un proceso y control del producto en moldeo, como deshidratadores y cargadores de material, así como termorreguladores y equipo de enfriamiento para el proceso, línea de ensamble y empaque de producto final.</li>
                            <li>Tiempos de entrega confiables.</li>
                            <li>Logísticas de surtimiento de acuerdo a sus necesidades.</li>
                            <li>Ganancia de calidad en los productos Iga.</li>
                            <li>Precios Accesibles.</li>
                            <li>Innovación constante en la imagen y empaque de productos.</li>
                            <li>Productos con código de barras en etiquetas.</li>
                            <li>Personal operativo calificado.</li>
                            <li>Equipo de ventas corporativa</li>
                        </ul>
                    </div>
                    <div className="w-1/2">
                        <p className="text-3xl font-bold">Licitaciones</p>
                        <p className="text-xl text-medium flex items-start gap-2 "><SiGooglecolab className="text-primary" />Colaboramos con empresas/instuciones gubernamentales que requieren de productos de calidad.</p>
                        <div className="mt-3 flex flex-wrap gap-5 items-center">
                            <figure className="w-1/3">
                                <img src={cfeLogo} alt="CFE Logo" />
                            </figure>
                            <figure className="w-1/5">
                                <img src={pemexLogo} alt="Pemex Logo" />
                            </figure>
                            <figure className="w-1/3">
                                <img src={asaLogo} alt="ASA Logo" />
                            </figure>
                        </div>
                        {/* <figure className="mt-5 bg-slate-950 p-5 rounded-xl mt-10">
                            <img src={IGALogo} alt="IGA Logo" />
                        </figure> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutIGA;