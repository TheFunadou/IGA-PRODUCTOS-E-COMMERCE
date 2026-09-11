import { useEffect } from "react";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { MapPin } from "lucide-react";
import IgaLogo from "../../assets/logo/IGA-LOGO.webp";
import { SUPPORT_EMAIL } from "../../modules/orders/utils/invoice";

const reportBrokenLinkMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Enlace roto en igaproductos.com"
)}&body=${encodeURIComponent("Encontré el siguiente enlace roto en igaproductos.com: ")}`;

const NotFoundPage = () => {
    const error = useRouteError();
    const is404 = isRouteErrorResponse(error) && error.status === 404;
    const code = isRouteErrorResponse(error) ? error.status : undefined;

    useEffect(() => {
        document.title = is404
            ? "Página no encontrada · Iga Productos"
            : "Error · Iga Productos";
        return () => {
            document.title = "Iga Productos";
        };
    }, [is404]);

    return (
        <section className="relative flex min-h-svh flex-col overflow-hidden bg-[linear-gradient(180deg,#0A111E_0%,#10203E_55%,#172554_100%)] text-white [font-family:Roboto,system-ui,sans-serif]">
            {/* textura de parcela (grilla 1×1) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
                    backgroundSize: "5rem 5rem",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]"
            />

            <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8 md:px-10">
                <Link
                    to="/"
                    className="block w-28 shrink-0 sm:w-32"
                    aria-label="Iga Productos · Volver al inicio"
                >
                    <img src={IgaLogo} alt="Logo Iga Productos" className="w-full object-contain" />
                </Link>
                <Link
                    to="/"
                    className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
                >
                    Volver al inicio
                </Link>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
                {/* marcador de coordenadas */}
                <div className="marker-drop relative mb-9 flex h-16 w-16 items-center justify-center">
                    <span className="marker-ping absolute inset-0 rounded-full border-2 border-[#FF5252]/40" />
                    <span
                        className="marker-ping absolute inset-0 rounded-full border-2 border-[#FF5252]/30"
                        style={{ animationDelay: "1.2s" }}
                    />
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                        <MapPin className="h-7 w-7 text-[#FF5252]" strokeWidth={2.2} />
                    </span>
                </div>

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-white/55 sm:text-sm">
                    {is404
                        ? "Código 404 · Página no encontrada"
                        : code
                            ? `Código ${code} · Error inesperado`
                            : "Error inesperado"}
                </p>

                <h1 className="mt-4 max-w-5xl font-staatliches text-4xl uppercase leading-[0.95] tracking-tight text-balance text-white sm:text-6xl md:text-7xl lg:text-8xl">
                    {is404 ? "ESA PÁGINA NO ESTÁ EN EL MAPA" : "ALGO SE ATORÓ EN EL CAMINO"}
                </h1>

                <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
                    {is404
                        ? "Revisa la dirección o vuelve a empezar desde el inicio; puede que el enlace haya cambiado de lugar."
                        : "No se realizó ningún cargo ni cambio en tu cuenta. Recarga la página y, si el problema continúa, escríbenos para resolverlo de inmediato."}
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1220] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                    >
                        Volver al inicio
                    </Link>
                    {is404 ? (
                        <a
                            href={reportBrokenLinkMailto}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                        >
                            Reportar enlace
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                        >
                            Reintentar
                        </button>
                    )}
                </div>
            </main>

            <footer className="relative z-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 px-5 py-5 text-center text-xs text-white/55 sm:flex-row sm:text-left sm:px-8 md:px-10">
                <p className="uppercase tracking-[0.25em] text-white/40">
                    Iga Productos · Cascos de seguridad
                </p>
                <p>
                    ¿Sigue sin resolverse?{" "}
                    <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="font-medium text-white/85 underline underline-offset-4 hover:text-white"
                    >
                        {SUPPORT_EMAIL}
                    </a>
                </p>
            </footer>
        </section>
    );
};

export default NotFoundPage;