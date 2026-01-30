import Header2 from "../../../assets/headers/HEADER2.webp"
import IGALogo from "../../../assets/logo/IGA-LOGO.webp"
import PartnersCarousel from "../components/PartnersCarousel";


const Distributors = () => {
    return (
        <div className="w-full bg-base-300 px-5 pt-10 pb-25 rounded-xl">
            <p className="text-3xl font-bold">Distribuidores</p>
            <div className=" text-white rounded-xl bg-top" style={{ backgroundImage: `url(${Header2})` }}>
                <div className="flex px-60 py-15 bg-blue-950/90 rounded-xl">
                    <div className="w-1/2 p-5 rounded-xl">
                        <p className="text-3xl font-bold">Distribuidores Autorizados</p>
                        <section className="text-lg/8 text-justify mt-5">
                            <p className="text-xl font-bold">Únete a los distribuidores autorizado de Iga Productos</p>
                            <p>Ser distribuidor autorizado de IGA Productos te abre las puertas a un mundo de oportunidades en el sector de seguridad industrial</p>
                            <p>Contactanos a: </p>
                            <a href="mailto:atencionacliente@igaproductos.com.mx" className="underline">atencionacliente@igaproductos.com.mx</a>
                        </section>
                    </div>
                    <div className="w-1/2  flex items-end">
                        <figure className="ml-10 w-3/4">
                            <img src={IGALogo} alt="IGA productos Logo" />
                        </figure>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <PartnersCarousel />
            </div>
        </div>
    );
};

export default Distributors;