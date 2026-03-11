import { useState, useEffect } from "react";
import HeroIMG from "../../../assets/hero/HeroImg2.png";
import { ChevronRight, ShieldCheck } from "lucide-react"; // o el ícono que uses en el fragmento
import { useThemeStore } from "../../../layouts/states/themeStore";
import PartnersCarousel from "./PartnersCarousel";

export default function Hero() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    const [in_, setIn] = useState(false);
    useEffect(() => { const t = setTimeout(() => setIn(true), 60); return () => clearTimeout(t); }, []);

    const enter = (d = 0) => ({
        transitionDelay: `${d}s`,
        opacity: in_ ? 1 : 0,
        transform: in_ ? "none" : "translateY(20px)",
        transition: `opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)`,
    });

    return (
        <div className={`
            relative rounded-t-2xl overflow-hidden flex items-stretch
            min-h-[360px] md:min-h-[480px] lg:min-h-[600px]
            ${isDark ? "bg-[#030d24]" : "bg-gradient-to-b from-base-100 via-base-200 to-base-300"}
        `}>
            {/* ░░ GRAIN */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-[0.06] pointer-events-none">
                <filter id="g">
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#g)" />
            </svg>

            {/* ░░ DIAGONAL SPLIT */}
            <div
                className={`absolute top-0 right-0 bottom-0 w-[48%] z-[1]
                    ${isDark ? "bg-gradient-to-br from-blue-900/50 to-[#04123c]/85"
                        : "bg-blue-950"}`}
                style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
            />

            {/* ░░ GLOW */}
            <div className={`absolute right-[15%] top-1/2 -translate-y-1/2 w-[40%] h-[80%]
                rounded-full z-[1] pointer-events-none blur-[40px]
                ${isDark ? "bg-[radial-gradient(ellipse,rgba(40,100,255,0.18)_0%,transparent_70%)]"
                    : "bg-[radial-gradient(ellipse,rgba(59,130,246,0.12)_0%,transparent_70%)]"}`}
            />

            {/* ░░ RULE LINES */}
            {[0, 33, 66, 100].map((t, i) => (
                <div key={i}
                    className={`absolute left-0 right-0 h-px z-[1] ${isDark ? "bg-white/[0.04]" : "bg-slate-300/40"}`}
                    style={{ top: `${t}%` }}
                />
            ))}

            {/* ░░ HELMET */}
            <div className="absolute right-[-3%] bottom-[-3%] z-[3] w-[clamp(200px,44%,560px)]"
                style={{ animation: "float 6s ease-in-out infinite" }}>
                <img
                    src={HeroIMG}
                    alt="Casco IGA"
                    className="w-full h-auto block"
                    style={{
                        mixBlendMode: isDark ? "multiply" : "normal",
                        filter: isDark
                            ? "contrast(1.05) brightness(1.08)"
                            : "contrast(1.02) drop-shadow(0 20px 40px rgba(59,130,246,0.25))",
                    }}
                />
            </div>

            {/* ░░ FLOATING STAT CHIPS */}
            {[
                { label: "NOM-115", sub: "Cascos", top: "14%", right: "38%", d: 0.7 },
                { label: "NOM-116", sub: "EPP", top: "38%", right: "42%", d: 0.85 },
                { label: "NOM-138", sub: "Guantes", top: "62%", right: "35%", d: 1.0 },
            ].map((c, i) => (
                <div key={i}
                    className={`absolute z-[6] flex items-center gap-2 rounded-md px-3 py-1.5
                        border backdrop-blur-xl
                        ${isDark ? "bg-white/[0.07] border-white/[0.14]"
                            : "bg-white/70 border-blue-200/60 shadow-sm"}`}
                    style={{ top: c.top, right: c.right, ...enter(c.d) }}
                >
                    <div className="w-[5px] h-[5px] rounded-full bg-blue-300/90 shrink-0" />
                    <div>
                        <div className={`font-mono text-[9px] font-extrabold
                            ${isDark ? "text-white/85" : "text-blue-700"}`}>{c.label}</div>
                        <div className={`text-[8px] mt-px ${isDark ? "text-white/40" : "text-slate-400"}`}>{c.sub}</div>
                    </div>
                </div>
            ))}

            {/* ░░ MAIN CONTENT */}
            <div className="relative z-[5] flex flex-col justify-center
                px-6 sm:px-10 lg:px-14 py-8 sm:py-12 lg:py-16
                max-w-[clamp(280px,52%,560px)] min-h-[inherit]">

                {/* ── Overline: línea azul sólida (igual al fragmento) */}
                <div className="w-10 h-[3px] rounded-full bg-blue-600 mb-4" style={enter(0)} />

                {/* ── Título: serif bold, igual al fragmento "Categorias principales" */}
                <div style={enter(0.1)}>
                    <p className={`font-serif text-lg sm:text-xl lg:text-2xl font-normal leading-snug mb-0.5
                        ${isDark ? "text-white/55" : "text-slate-400"}`}>
                        Protección que
                    </p>
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                        <span className={`font-serif text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[0.9] tracking-tight
                            ${isDark ? "text-white" : "text-slate-800"}`}>
                            inspira
                        </span>
                        <div className="bg-primary p-2 rounded-md my-2">
                            <span className="font-serif text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[0.9] tracking-tight
                            bg-white bg-clip-text text-transparent">
                                confianza
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Subtítulo como BADGE PILL (igual al fragmento) */}
                <div className="mt-4 mb-3" style={enter(0.2)}>
                    <span className="inline-flex items-center gap-2 rounded-full
                        bg-base-300 text-black
                        px-4 py-1.5 text-xs sm:text-sm font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        Cada jornada merece seguridad total
                    </span>
                </div>

                {/* ── Body */}
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-[400px]
                    ${isDark ? "text-white/40" : "text-slate-400"}`}
                    style={enter(0.3)}>
                    En Iga Productos ofrecemos artículos{" "}
                    <strong className={isDark ? "text-white/65" : "text-slate-600"}>
                        100% Hechos en México
                    </strong>{" "}
                    que cumplen estándares y cumplimientos normativos. Diseñados para cuidar tu desempeño sin comprometer tu comodidad.
                </p>

                {/* ── CTAs */}
                <div className="flex gap-2.5 flex-wrap mb-8 sm:mb-10" style={enter(0.38)}>
                    <button className="bg-primary text-white border-0
                        rounded-md px-6 sm:px-8 py-2.5 sm:py-3
                        text-[11px] sm:text-sm font-bold uppercase cursor-pointer
                        shadow-[0_6px_24px_rgba(59,130,246,0.4)]
                        hover:shadow-[0_12px_36px_rgba(59,130,246,0.55)] hover:-translate-y-0.5
                        transition-all duration-200 flex items-center gap-2">
                        Explorar tienda<ChevronRight />
                    </button>
                    <button className={`rounded-md px-6 sm:px-8 py-2.5 sm:py-3
                        text-[11px] sm:text-sm font-semibold uppercase cursor-pointer
                         backdrop-blur-lg hover:-translate-y-0.5 transition-all duration-200 shadow-sm
                        ${isDark
                            ? "bg-white/[0.06] text-white/75 border-white/20 hover:bg-white/[0.12] hover:text-white hover:border-white/40"
                            : "bg-white/60 text-slate-600 border-slate-300 hover:bg-white hover:text-slate-800 hover:border-blue-300"
                        }`}>
                        Conócenos
                    </button>
                </div>

                {/* ── Divider + Ticker */}
                <div style={enter(0.5)}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                        <span className={`font-mono text-[12px] font-bold tracking-[0.2em] uppercase
                            ${isDark ? "text-white/22" : "text-slate-300"}`}>
                            Inspirando confianza en
                        </span>
                        <div className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                    </div>
                    <PartnersCarousel />
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%,100%{transform:translateY(0) rotate(-1deg)}
                    50%{transform:translateY(-16px) rotate(0.8deg)}
                }
            `}</style>
        </div>
    );
}