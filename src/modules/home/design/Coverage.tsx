import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import Header2 from "../../../assets/headers/HEADER2.webp"

const Coverage = () => {
    document.title = "Iga Productos | Cobertura";
    return (
        <div className="w-full bg-base-300 px-3 sm:px-5 lg:px-5 pt-6 sm:pt-10 pb-16 sm:pb-25 rounded-xl">
            <div className="w-full animate-fade-in-up">
                {/* Header Section - Responsive */}
                <div className="text-white rounded-xl bg-top bg-cover" style={{ backgroundImage: `url(${Header2})` }}>
                    <div className="flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-60 py-6 sm:py-10 md:py-15 bg-blue-950/70 rounded-xl">
                        <div className="w-full lg:w-1/2 p-3 sm:p-5 rounded-xl mb-6 lg:mb-0">
                            <p className="text-2xl sm:text-3xl font-bold">Cobertura</p>
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
                </div>

                {/* Coverage Map Section - Responsive */}
                <div className="mt-6 sm:mt-8 lg:mt-10">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-2">
                        Unete a cobertura nacional e internacional!
                    </h3>
                    <section className="w-full mt-4 sm:mt-5">
                        <figure className="w-full">
                            <img
                                src="https://igaproductos.com.mx/wp-content/themes/igaproductos/images/cobertura_nacional_centroamerica.png"
                                alt="Zonas de cobertura nacional e internacional"
                                className="w-full h-auto rounded-lg"
                            />
                        </figure>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Coverage;