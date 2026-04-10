import { useState, useEffect } from "react";
import HeroIMG from "../../../assets/hero/HeroImg3.webp";
import { useThemeStore } from "../../../layouts/states/themeStore";
import PartnersCarousel from "./PartnersCarousel";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiChevronRight } from "react-icons/fi";
import { MdVerifiedUser, MdLocalShipping, MdMenuBook } from "react-icons/md";

export default function Hero() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const [in_, setIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setIn(true), 60);
        return () => clearTimeout(t);
    }, []);

    const enter = (d = 0) =>
    ({
        transitionDelay: `${d}s`,
        opacity: in_ ? 1 : 0,
        transform: in_ ? "none" : "translateY(20px)",
        transition: `opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1)`,
    } as React.CSSProperties);

    const badges = [
        { icon: MdVerifiedUser, text: "Seguridad Certificada" },
        { icon: MdLocalShipping, text: "Entrega Garantizada" },
        { icon: MdMenuBook, text: "Catálogo Completo" },
    ];

    const chips = [
        { label: "Seguridad", top: "14%", right: "6%" },
        { label: "Calidad", top: "46%", right: "4%" },
        { label: "Confianza", top: "72%", right: "8%" },
    ];

    return (
        <div
            className={[
                "relative rounded-2xl overflow-hidden",
                "min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[640px]",
                isDark ? "bg-[#030d24]" : "bg-white",
            ].join(" ")}
        >
            {/* ── GRAIN overlay ── */}
            <svg
                className="absolute inset-0 w-full h-full z-0 opacity-[0.04] pointer-events-none"
                aria-hidden
            >
                <filter id="hero-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="4"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#hero-grain)" />
            </svg>

            {/* ── MOBILE background image (< md) ── */}
            <div className="absolute inset-0 z-[1] md:hidden">
                <img
                    src={HeroIMG}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    style={{ opacity: isDark ? 0.15 : 0.1 }}
                />
                <div
                    className={[
                        "absolute inset-0",
                        isDark
                            ? "bg-gradient-to-br from-[#030d24]/90 via-[#030d24]/75 to-[#030d24]/60"
                            : "bg-gradient-to-br from-white/95 via-white/85 to-white/70",
                    ].join(" ")}
                />
            </div>

            {/* ── DESKTOP navy diagonal panel (md+) ── */}
            <div
                className="absolute top-0 right-0 bottom-0 z-[2] overflow-hidden hidden md:block"
                style={{
                    width: "55%",
                    clipPath: "polygon(9% 0, 100% 0, 100% 100%, 0% 100%)",
                    background: isDark
                        ? "linear-gradient(140deg,#0d2260 0%,#04123c 100%)"
                        : "#0f2460",
                }}
            >
                <img
                    src={HeroIMG}
                    alt="Equipo de Protección Personal IGA"
                    className="absolute inset-0 w-full h-full object-cover object-bottom"
                    style={{
                        opacity: isDark ? 0.72 : 1,
                        filter: isDark
                            ? "contrast(1.1) brightness(0.82)"
                            : "contrast(1.03)",
                    }}
                />
                {/* Depth overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: isDark
                            ? "linear-gradient(to right, rgba(4,18,60,0.6) 0%, transparent 55%)"
                            : "linear-gradient(to right, rgba(15,36,96,0.4) 0%, transparent 60%)",
                    }}
                />
            </div>

            {/* ── Decorative horizontal rules ── */}
            {[0, 33, 66, 100].map((t, i) => (
                <div
                    key={i}
                    className="absolute left-0 right-0 h-px z-[1] pointer-events-none"
                    style={{
                        top: `${t}%`,
                        background: isDark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(15,36,96,0.05)",
                    }}
                />
            ))}

            {/* ── Floating chips — desktop only ── */}
            {chips.map((c, i) => (
                <div
                    key={i}
                    className={[
                        "absolute z-[8] hidden md:flex items-center gap-2",
                        "rounded-md px-3 py-1.5 backdrop-blur-xl",
                    ].join(" ")}
                    style={{
                        top: c.top,
                        right: c.right,
                        ...enter(0.55 + i * 0.12),
                        background: isDark
                            ? "rgba(255,255,255,0.09)"
                            : "rgba(255,255,255,0.72)",
                        border: isDark
                            ? "1px solid rgba(255,255,255,0.14)"
                            : "1px solid rgba(59,130,246,0.22)",
                        boxShadow: "0 2px 12px rgba(15,36,96,0.12)",
                    }}
                >
                    <span
                        className="w-[6px] h-[6px] rounded-full shrink-0"
                        style={{ background: isDark ? "#93c5fd" : "#2563eb" }}
                    />
                    <span
                        className="font-mono text-[9px] font-extrabold tracking-wider uppercase"
                        style={{
                            color: isDark ? "rgba(255,255,255,0.88)" : "#1d4ed8",
                        }}
                    >
                        {c.label}
                    </span>
                </div>
            ))}

            {/* ══════════════════════════════════════════
                MAIN CONTENT COLUMN
            ══════════════════════════════════════════ */}
            <div
                className={[
                    "relative z-[5] flex flex-col justify-center",
                    "px-5 sm:px-8 md:px-10 lg:px-16",
                    "py-10 sm:py-12 md:py-14 lg:py-20",
                    "w-full md:w-[56%] lg:w-[54%]",
                    "min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[640px]",
                ].join(" ")}
            >
                {/* Overline accent bar */}
                <div
                    className="w-10 h-[3px] rounded-full bg-primary mb-4 sm:mb-5"
                    style={enter(0)}
                />

                {/* ── SUB-HEADLINE — secondary legend, smaller hierarchy ── */}
                <p
                    className={[
                        "text-[11px] sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3",
                        isDark ? "text-blue-400/80" : "text-primary",
                    ].join(" ")}
                    style={enter(0.06)}
                >
                    Cuidando el capital intelectual de tu empresa
                </p>

                {/* ── MAIN HEADLINE ── */}
                <div style={enter(0.13)}>
                    <h1
                        className={[
                            "font-black leading-[1.05] tracking-tight mb-3 sm:mb-4",
                            isDark ? "text-white" : "text-slate-900",
                        ].join(" ")}
                        style={{ fontSize: "clamp(1.55rem, 4vw, 3.1rem)" }}
                    >
                        Garantizamos tu confianza
                        <br />
                        con{" "}
                        <span className="text-primary">Productos</span>{" "}
                        de la mejor calidad
                    </h1>
                </div>

                {/* ── DESCRIPTION ── */}
                <p
                    className={[
                        "text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 max-w-[430px]",
                        isDark ? "text-white/50" : "text-slate-500",
                    ].join(" ")}
                    style={enter(0.2)}
                >
                    Protección que inspira confianza. En Iga Productos, nos dedicamos a la
                    venta de cascos, lentes, barboquejos, suspensiones y más, todo en un
                    solo lugar.{" "}
                    <strong
                        className={isDark ? "text-white/80" : "text-blue-900"}
                    >
                        Calidad probada y cumplimiento normativo 100% Hecho en México.
                    </strong>
                </p>

                {/* ── TRUST BADGES ── */}
                <div
                    className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 mb-5 sm:mb-7"
                    style={enter(0.28)}
                >
                    {badges.map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 shrink-0">
                            <div
                                className={[
                                    "w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center shrink-0",
                                    isDark
                                        ? "bg-primary/20 border border-primary/30"
                                        : "bg-primary/5 border border-primary/20",
                                ].join(" ")}
                            >
                                <Icon
                                    size={12}
                                    className="text-primary"
                                />
                            </div>
                            <span
                                className={[
                                    "text-[10px] sm:text-[11px] font-semibold whitespace-nowrap",
                                    isDark ? "text-white/65" : "text-slate-600",
                                ].join(" ")}
                            >
                                {text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── CTAs ── */}
                <div
                    className="flex flex-wrap gap-2 sm:gap-3 mb-7 sm:mb-9"
                    style={enter(0.36)}
                >
                    <button
                        onClick={() => navigate("/tienda")}
                        className={[
                            "btn btn-primary flex items-center gap-2",
                            "font-bold uppercase tracking-wide",
                            "text-[11px] sm:text-xs",
                            "rounded-md px-5 sm:px-7 py-2.5 sm:py-3",
                            "transition-all duration-200",
                            "hover:-translate-y-0.5 active:scale-[0.98]",
                        ].join(" ")}
                    >
                        <FiShoppingBag size={14} />
                        Explorar tienda
                        <FiChevronRight size={13} />
                    </button>

                    <button
                        onClick={() => navigate("/acerca-de-iga")}
                        className={[
                            "font-semibold uppercase tracking-wide",
                            "rounded-md px-5 sm:px-7 py-2.5 sm:py-3",
                            "text-[11px] sm:text-xs",
                            "transition-all duration-200 backdrop-blur-sm",
                            "hover:-translate-y-0.5 active:scale-[0.98]",
                            isDark
                                ? "bg-white/7 border border-white/18 text-white/75 hover:bg-white/12"
                                : "bg-white/90 border border-slate-300 text-slate-600 hover:bg-white",
                        ].join(" ")}
                    >
                        Conócenos
                    </button>
                </div>

                {/* ── Divider + Partners ── */}
                <div style={enter(0.44)}>
                    <div className="flex items-center gap-3 mb-3 max-w-sm">
                        <div
                            className={[
                                "h-px flex-1",
                                isDark ? "bg-white/8" : "bg-slate-200",
                            ].join(" ")}
                        />
                        <span
                            className={[
                                "font-mono text-[10px] sm:text-[11px] font-bold",
                                "tracking-[0.18em] uppercase whitespace-nowrap",
                                isDark ? "text-white/22" : "text-slate-400",
                            ].join(" ")}
                        >
                            Inspirando confianza en
                        </span>
                        <div
                            className={[
                                "h-px flex-1",
                                isDark ? "bg-white/8" : "bg-slate-200",
                            ].join(" ")}
                        />
                    </div>
                    <div className="max-w-sm">
                        <PartnersCarousel />
                    </div>
                </div>
            </div>
        </div>
    );
}