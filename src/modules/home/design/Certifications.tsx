import { PiCertificateBold } from "react-icons/pi";
import Header1 from "../../../assets/headers/HEADER_1.webp"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import { BiSolidCertification } from "react-icons/bi";


const Certifications = () => {
    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                <div className="px-60 py-15 flex text-white rounded-xl bg-right" style={{ backgroundImage: `url(${Header1})` }}>
                    <div className="w-1/2">
                        <p className="text-3xl font-bold">Cumplimientos normativos</p>
                        <section className="text-lg/8 text-justify mt-5">
                            <p>Plásticos del Golfo-Sur, S.A. de C.V. Es una empresa 100% mexicana, certificada bajo la norma ISO 9001:2015; especializada en la producción, comercialización y distribución de lentes, barboquejos y cascos de seguridad industrial.</p>
                        </section>
                    </div>
                    <div className="w-1/2  flex items-end">
                        <figure className="ml-10 w-3/4">
                            <img src={IGALogo} alt="IGA productos Logo" />
                        </figure>
                    </div>
                </div>
                <div className="w-full mt-5">
                    <div>
                        <p className="text-4xl rounded-xl font-bold">Conoce los cumplimientos normativos con los que cumplimos</p>
                        <div className="mt-5 w-full flex">
                            <div className="w-1/2 flex flex-col gap-5 pr-5">
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />NOM-115-STPS-2009</strong>
                                    <p className="text-lg text-justify">La norma oficial mexicana establece los requisitos mínimos que deberán cumplir los
                                        cascos de protección que se comercializan en territorio nacional.</p>
                                </div>
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />NMX-S-055-SCF1-2002</strong>
                                    <p className="text-lg text-justify">La norma mexicana de sugerencia establece los requisitos mínimoy slo s métodos de
                                        prueba que deben cumplir, de acuerdo a su clasificación, los cascos de protección
                                        industrial que se utilizan en los centros de trabajo.</p>
                                </div>
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />CFE: 8H 342-02</strong>
                                    <p className="text-lg text-justify">Establece las características técnicas que deben cumplir los cascos de protección contra
                                        impactos manera limitada contra descargas eléctricas.</p>
                                </div>
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />PEMEX-EST-SS-058-2018</strong>
                                    <p className="text-lg text-justify">El Estándar Técnico establece los requisitos técnicos que deben cumplir los cascos de
                                        protección para la cabeza de uso industrial; Así como los requisitos documentales y la
                                        hoja de especificaciones respectiva.</p>
                                </div>
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />ANSI/ISEA Z89.1-2014 (R2019)</strong>
                                    <p className="text-lg text-justify">Esta norma establece los requisitos mínimos de rendimiento para cascos protectores
                                        que reducen las fuerzas de impacto y la penetración y que puedan proporcionar
                                        protección contra descargas eléctricas (no para arco eléctrico).</p>
                                </div>
                                <div>
                                    <strong className="text-3xl flex items-center gap-2 "><BiSolidCertification />1SO 9001:2015</strong>
                                    <p className="text-lg text-justify">Es el estándar internacional de carácter certificable que regula los Sistemas de Gestión
                                        de la Calidad</p>
                                </div>
                            </div>
                            <div className="w-1/2 pl-5">
                                <div className="w-full h-full bg-blue-950 shadow-lg rounded-xl flex flex-col items-center justify-center">
                                    <div className="rounded-xl">
                                        <img src={IGALogo} alt="Iga Productos" />
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <PiCertificateBold className="text-white text-7xl" />
                                        <p className="text-4xl font-medium text-white">Empresa 100% certificada</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl mt-5 font-bold text-center">Da clic en cualquier cumplimiento normativo para ver mas detalles</h3>
                    <div className="w-full flex justify-center mt-5 [&_div]:text-center [&_div]:text-4xl [&_div]:font-bold">
                        <div className="flex-1 px-10" >
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/1portadaancejpg_P%C3%A1gina_1.jpg" target="_blank">
                                <figure className="1/4">
                                    <img src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/1portadaancejpg_P%C3%A1gina_1.jpg" alt="Certificado de conformidad de producto 1" />
                                </figure>
                            </a>
                        </div>
                        <div className="flex-1 px-10">
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/2portadaance.jpg" target="_blank">
                                <figure>
                                    <img src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/2portadaance.jpg" alt="Certificado de confromidad de producto 2" />
                                </figure>
                            </a>
                        </div>
                        <div className="flex-1 px-10">
                            <a href="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/3portadaics_P%C3%A1gina_1.jpg" target="_blank">
                                <figure>
                                    <img src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/certificaciones/3portadaics_P%C3%A1gina_1.jpg" alt="Certificado de conformidad de producto 3" />
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