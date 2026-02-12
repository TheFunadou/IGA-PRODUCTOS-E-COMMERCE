import { PiCertificateBold } from "react-icons/pi";
import Header1 from "../../../assets/headers/HEADER_1.webp"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import { BiSolidCertification } from "react-icons/bi";


const Certifications = () => {
    return (
        <div className="w-full bg-base-300 px-3 sm:px-5 lg:px-5 pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                {/* Header Section - Responsive */}
                <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 flex flex-col lg:flex-row text-white rounded-xl bg-cover bg-center lg:bg-right" style={{ backgroundImage: `url(${Header1})` }}>
                    <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
                        <p className="text-2xl sm:text-3xl font-bold">Cumplimientos normativos</p>
                        <section className="text-base sm:text-lg leading-6 sm:leading-8 text-justify mt-3 sm:mt-5">
                            <p>Plásticos del Golfo-Sur, S.A. de C.V. Es una empresa 100% mexicana, certificada bajo la norma ISO 9001:2015; especializada en la producción, comercialización y distribución de lentes, barboquejos y cascos de seguridad industrial.</p>
                        </section>
                    </div>
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:items-end">
                        <figure className="lg:ml-10 w-full sm:w-3/4 max-w-sm">
                            <img src={IGALogo} alt="IGA productos Logo" className="w-full h-auto" />
                        </figure>
                    </div>
                </div>

                {/* Certifications Content Section */}
                <div className="w-full mt-5">
                    <div>
                        <p className="text-2xl sm:text-3xl lg:text-4xl rounded-xl font-bold">Conoce los cumplimientos normativos con los que cumplimos</p>

                        {/* Two Column Layout - Responsive */}
                        <div className="mt-5 w-full flex flex-col lg:flex-row gap-5">
                            {/* Left Column - Certifications List */}
                            <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5">
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>NOM-115-STPS-2009</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        La norma oficial mexicana establece los requisitos mínimos que deberán cumplir los cascos de protección que se comercializan en territorio nacional.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>NMX-S-055-SCF1-2002</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        La norma mexicana de sugerencia establece los requisitos mínimoy slo s métodos de prueba que deben cumplir, de acuerdo a su clasificación, los cascos de protección industrial que se utilizan en los centros de trabajo.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>CFE: 8H 342-02</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        Establece las características técnicas que deben cumplir los cascos de protección contra impactos manera limitada contra descargas eléctricas.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>PEMEX-EST-SS-058-2018</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        El Estándar Técnico establece los requisitos técnicos que deben cumplir los cascos de protección para la cabeza de uso industrial; Así como los requisitos documentales y la hoja de especificaciones respectiva.
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>ANSI/ISEA Z89.1-2014 (R2019)</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        Esta norma establece los requisitos mínimos de rendimiento para cascos protectores que reducen las fuerzas de impacto y la penetración y que puedan proporcionar protección contra descargas eléctricas (no para arco eléctrico).
                                    </p>
                                </div>
                                <div>
                                    <strong className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-2">
                                        <BiSolidCertification className="flex-shrink-0" />
                                        <span>1SO 9001:2015</span>
                                    </strong>
                                    <p className="text-base sm:text-lg text-justify mt-1 sm:mt-0">
                                        Es el estándar internacional de carácter certificable que regula los Sistemas de Gestión de la Calidad
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Certified Badge */}
                            <div className="w-full lg:w-1/2">
                                <div className="w-full h-full bg-blue-950 shadow-lg rounded-xl flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:py-0">
                                    <div className="rounded-xl w-full max-w-md">
                                        <img src={IGALogo} alt="Iga Productos" className="w-full h-auto" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-4 sm:mt-2">
                                        <PiCertificateBold className="text-white text-5xl sm:text-6xl lg:text-7xl" />
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white text-center sm:text-left">
                                            Empresa 100% certificada
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Text */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl mt-5 font-bold text-center px-2">
                        Da clic en cualquier cumplimiento normativo para ver mas detalles
                    </h3>

                    {/* Certificates Images Grid - Responsive */}
                    <div className="w-full flex flex-col sm:flex-row justify-center items-stretch mt-5 gap-4 sm:gap-0 [&_div]:text-center [&_div]:text-2xl sm:[&_div]:text-3xl lg:[&_div]:text-4xl [&_div]:font-bold">
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-10" >
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/1portadaancejpg_P%C3%A1gina_1.jpg" target="_blank" rel="noopener noreferrer">
                                <figure className="w-full hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/1portadaancejpg_P%C3%A1gina_1.jpg"
                                        alt="Certificado de conformidad de producto 1"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </figure>
                            </a>
                        </div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-10">
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/2portadaance.jpg" target="_blank" rel="noopener noreferrer">
                                <figure className="w-full hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/2portadaance.jpg"
                                        alt="Certificado de confromidad de producto 2"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </figure>
                            </a>
                        </div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-10">
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/3portadaics_P%C3%A1gina_1.jpg" target="_blank" rel="noopener noreferrer">
                                <figure className="w-full hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/3portadaics_P%C3%A1gina_1.jpg"
                                        alt="Certificado de conformidad de producto 3"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </figure>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certifications;