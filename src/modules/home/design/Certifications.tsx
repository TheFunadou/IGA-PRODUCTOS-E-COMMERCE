import HeaderIMG from "../../../assets/headers/IMG-1.png"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"


const Certifications = () => {
    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                <div className="px-60 py-15 flex text-white rounded-xl bg-right" style={{ backgroundImage: `url(${HeaderIMG})` }}>
                    <div className="w-1/2">
                        <p className="text-3xl font-bold">Certificaciones</p>
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
                    <h3 className="text-2xl font-bold text-center">Da clic en cualquier certificación para ver mas detalles</h3>

                    <div className="w-full flex justify-center mt-10 [&_div]:text-center [&_div]:text-4xl [&_div]:font-bold">
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