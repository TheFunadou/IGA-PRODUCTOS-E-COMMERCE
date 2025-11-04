import HeaderIMG2 from "../../../assets/headers/IMG-2.png";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"

const Coverage = () => {
    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                <div className=" text-white rounded-xl bg-top" style={{ backgroundImage: `url(${HeaderIMG2})` }}>
                    <div className="flex px-60 py-15 bg-blue-950/70 rounded-xl">
                        <div className="w-1/2 p-5 rounded-xl">
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
                </div>
                <div className="mt-10">
                    <h3 className="text-4xl font-bold text-center">Unete a nuestra red de distribuidores!</h3>
                    <section className="w-full mt-5">
                        <figure>
                            <img src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/cobertura_nacional_centroamerica.png" alt="Zonas" />
                        </figure>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Coverage;