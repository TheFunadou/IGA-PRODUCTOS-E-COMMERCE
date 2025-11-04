

const PoliticaPrivacidad = () => {
    return (
        <section id="#home" className="w-full bg-base-300 rounded-xl flex px-5 py-10">
            <article className="w-20/100  px-5 relative">
                <div className="w-full bg-blue-950 text-white rounded-xl roudede-xl p-5 sticky top-5">
                    <p className="text-lg font-bold">Directorio</p>
                    <ol className="list-decimal flex flex-col gap-10 px-5 py-5 mt-3 [&_li]:hover:font-bold">
                        <li><a href="#home">Inicio</a></li>
                        <li><a href="#about-us">Quienes somos</a></li>
                        <li><a href="#comments">Comentarios</a></li>
                        <li><a href="#cookies">Cookies</a></li>
                        <li><a href="#data-sharing">Con quien compartimos sus datos</a></li>
                        <li><a href="#data-conservation">Cuanto tiempo conservamos sus datos</a></li>
                        <li><a href="#my-rights">Que derechos tienes sobre tus datos</a></li>
                        <li><a href="#data-send">A donde enviamos tus datos</a></li>
                    </ol>
                </div>
            </article>
            <article className="w-80/100  flex flex-col gap-5 mr-10">
                <p className="text-3xl font-bold">Política de privacidad</p>
                <p className="text-justify text-base/8 ">
                    Los datos personales que recabamos sobre usted son necesarios para verificar y confirmar su identidad; administrar y comercializar los productos que solicita con nosotros, y para cumplir con las obligaciones derivadas de dicha comercialización, finalidades que son necesarias para el servicio que solicita.
                    <br />
                    La empresa se compromete a no usar los datos proporcionados con fines lucrativos, de manera adicional, utilizaremos su información personal para informarle sobre nuevas propuestas de comercialización, servicios y promociones.
                    <br />
                    En los formularios pedimos información como nombre, correo, teléfono, el mensaje o interés, área a la que desea preguntar y si está interesado en una vacante se canaliza con el departamento responsable y cuidamos tu seguridad de la información recibida.
                    <br />
                    Después de que se recibe la información del formulario, la documentación solo estará disponible al departamento encargado para direccionar hacia el área responsable de dar la información y no se podrán compartir a terceros.
                </p>
                <div id="about-us">
                    <p className="text-2xl font-bold">Quienes somos</p>
                    <p className="text-justify text-base/8">
                        La dirección de nuestro sitio web es:  https://igaproductos.com.mx/
                        <br />
                        Cuando los visitantes dejan comentarios en el sitio, recopilamos los datos que se muestran en el formulario de comentarios, y también la dirección IP del visitante y la cadena del agente de usuario del navegador para ayudar a la detección de spam.
                    </p>
                </div>
                <div id="comments">
                    <p className="text-2xl font-bold">Comentarios</p>
                    <p className="text-justify text-base/8 ">
                        Se puede proporcionar una cadena anónima creada a partir de su dirección de correo electrónico (también llamada hash) al servicio Gravatar para ver si la está utilizando. La política de privacidad del servicio Gravatar está disponible aquí: https://igaproductos.com.mx/privacy-polity/. Después de la aprobación de su comentario, su foto de perfil es visible para el público en el contexto de su comentario.
                    </p>
                </div>
                <div id="cookies">
                    <p className="text-2xl font-bold">Cookies</p>
                    <p className="text-justify text-base/8 ">
                        Si deja un comentario en nuestro sitio, puede optar por guardar su nombre, dirección de correo electrónico y sitio web en cookies. Estos son para su conveniencia para que no tenga que volver a completar sus datos cuando deje otro comentario. Estas cookies durarán un año.
                        <br />
                        Si visita nuestra página de inicio de sesión, configuraremos una cookie temporal para determinar si su navegador acepta cookies. Esta cookie no contiene datos personales y se descarta cuando cierra su navegador.
                        <br />
                        Cuando inicie sesión, también configuraremos varias cookies para guardar su información de inicio de sesión y sus opciones de visualización de pantalla.
                        <br />
                        Las cookies de inicio de sesión duran dos días y las cookies de opciones de pantalla duran un año. Si selecciona “Recordarme”, su inicio de sesión se mantendrá durante dos semanas. Si cierra sesión en su cuenta, se eliminarán las cookies de inicio de sesión.
                        <br />
                        Si edita o publica un artículo, se guardará una cookie adicional en su navegador. Esta cookie no incluye datos personales y simplemente indica el ID de publicación del artículo que acaba de editar. Caduca después de 1 día.
                    </p>
                </div>
                <div id="data-sharing">
                    <p className="text-2xl font-bold">Con quién compartimos sus datos</p>
                    <p className="text-justify text-base/8 ">
                        Si solicita un restablecimiento de contraseña, su dirección IP se incluirá en el correo electrónico de restablecimiento.
                    </p>
                </div>
                <div id="data-conservation">
                    <p className="text-2xl font-bold">Cuánto tiempo conservamos sus datos</p>
                    <p className="text-justify text-base/8 ">
                        Si deja un comentario, el comentario y sus metadatos se conservan indefinidamente. Esto es para que podamos reconocer y aprobar cualquier comentario de seguimiento automáticamente en lugar de mantenerlos en una cola de moderación.
                        <br />
                        Para los usuarios que se registran en nuestro sitio web (si corresponde), también almacenamos la información personal que proporcionan en su perfil de usuario. Todos los usuarios pueden ver, editar o eliminar su información personal en cualquier momento (excepto que no pueden cambiar su nombre de usuario). Los administradores del sitio web también pueden ver y editar esa información.
                    </p>
                </div>
                <div id="my-rights">
                    <p className="text-2xl font-bold">Que derechos tienes sobre tus datos</p>
                    <p className="text-justify text-base/8">
                        Si tiene una cuenta en este sitio o ha dejado comentarios, puede solicitar recibir un archivo exportado de los datos personales que tenemos sobre usted, incluidos los datos que nos haya proporcionado. También puede solicitar que borremos cualquier dato personal que tengamos sobre usted. Esto no incluye ningún dato que estemos obligados a conservar con fines administrativos, legales o de seguridad.
                    </p>
                </div>
                <div id="data-send">
                    <p className="text-2xl font-bold">A donde enviamos sus datos</p>
                    <p className="text-justify text-base/8">
                        Los comentarios de los visitantes pueden verificarse a través de un servicio de detección automática de spam.
                    </p>
                </div>
            </article>

        </section>
    );
};

export default PoliticaPrivacidad;