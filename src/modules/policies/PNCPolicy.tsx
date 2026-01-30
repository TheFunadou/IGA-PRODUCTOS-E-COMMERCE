

const PNCPolicy = () => {
    return (
        <div className="bg-white py-10 px-50 rounded-xl">
            <h1>Política de devolución PNC</h1>

            <section className="mt-5 text-justify text-lg flex flex-col gap-5">
                <p>
                    En <strong>IGA Productos</strong>, valoramos la satisfacción de nuestros clientes y nos esforzamos por ofrecer productos de alta calidad que cumplan con sus expectativas. Por lo tanto, hemos desarrollado una política de devolución para apoyar a nuestros clientes en caso de que se presente alguna de las situaciones descritas a continuación.
                </p>

                <p>
                    A continuación, se detallan los términos y condiciones de esta política:
                </p>

                <h3>En caso de Producto No Conforme</h3>

                <div>
                    <h4>Formulario</h4>
                    <p>
                        Para solicitar un proceso de devolución de producto, deberá llenar el siguiente formulario
                        (<a href="/contacto">Ir a contacto</a>) o bien reportar dicha inconformidad vía correo electrónico al área de atención a clientes
                        (<a href="mailto:atencionacliente@igaproductos.com.mx">atencionacliente@igaproductos.com.mx</a>),
                        con copia a la administración general
                        (<a href="mailto:administracion@igaproductos.com.mx">administracion@igaproductos.com.mx</a>).
                    </p>
                </div>

                <div>
                    <h4>Garantía</h4>
                    <p>
                        La garantía será válida únicamente cuando la mercancía y/o el artículo adquirido presente defectos de fábrica y/o daños severos, visibles e imputables al manejo en almacén o durante su traslado por parte de la paquetería.
                        En estos casos, <strong>IGA Productos</strong> se reserva el derecho de cancelación.
                    </p>
                </div>

                <div>
                    <h4>Devolución</h4>
                    <p>
                        <strong>IGA Productos</strong> podrá recibir mercancía como devolución únicamente proporcionando el número de lote y el número de folio de la factura. En caso de no contar con esta información, la mercancía no será aceptada.
                    </p>
                </div>

                <p>
                    La devolución podrá ser recibida en un plazo máximo de <strong>48 horas</strong> posteriores a la recepción del producto.
                    No se aceptarán devoluciones en casos de error de pedido relacionados con producto, modelo, clase, ajuste, color o marca.
                </p>
            </section>

        </div>
    );
};

export default PNCPolicy;