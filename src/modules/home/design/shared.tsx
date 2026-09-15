import type { ElementType, ReactNode } from "react";
import clsx from "clsx";
import IGALogo from "../../../assets/logo/IGA-LOGO.webp";
import { useThemeStore } from "../../../layouts/states/themeStore";

interface PageHeroProps {
    image: string;
    title: string;
    eyebrow?: string;
    paragraphs?: ReactNode;
    badges?: ReactNode;
    overlayClassName?: string;
}

export const PageHero = ({
    image,
    title,
    eyebrow,
    paragraphs,
    badges,
    overlayClassName,
}: PageHeroProps) => (
    <div
        className="relative overflow-hidden rounded-2xl shadow-lg bg-cover bg-center lg:bg-right"
        style={{ backgroundImage: `url(${image})` }}
    >
        <div
            className={
                overlayClassName ??
                "absolute inset-0 bg-linear-to-r from-blue-950/95 via-blue-950/75 to-blue-950/25"
            }
        />
        <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-10 px-5 sm:px-10 md:px-14 lg:px-16 xl:px-24 py-10 sm:py-14">
            <div className="w-full lg:w-3/5 min-w-0">
                {eyebrow && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-0.5 bg-primary rounded-full" aria-hidden="true" />
                        <span className="text-white/70 text-xs uppercase tracking-widest font-semibold">
                            {eyebrow}
                        </span>
                    </div>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                    {title}
                </h1>
                {paragraphs && (
                    <div className="mt-4 space-y-3 max-w-prose text-sm sm:text-base leading-7 text-white/90 drop-shadow">
                        {paragraphs}
                    </div>
                )}
                {badges && <div className="flex flex-wrap gap-2 mt-5">{badges}</div>}
            </div>
            <figure className="shrink-0 w-1/2 sm:w-1/3 lg:w-2/5 max-w-[220px] lg:max-w-xs drop-shadow-2xl">
                <img
                    src={IGALogo}
                    alt="IGA productos Logo"
                    className="w-full h-auto filter brightness-0 invert"
                    loading="lazy"
                />
            </figure>
        </div>
    </div>
);

interface HomeSectionProps {
    children: ReactNode;
    tinted?: boolean;
    id?: string;
}

export const HomeSection = ({ children, tinted = false, id }: HomeSectionProps) => (
    <section
        id={id}
        className={clsx(
            "py-12 md:py-16 scroll-mt-24",
            tinted && "border-y border-base-200/60 bg-base-200/25"
        )}
    >
        {children}
    </section>
);

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    icon?: ElementType;
    center?: boolean;
}

export const SectionHeading = ({
    title,
    subtitle,
    icon: Icon,
    center = false,
}: SectionHeadingProps) => {
    const { theme } = useThemeStore();

    if (center) {
        return (
            <header className="mb-6 md:mb-8">
                <h2 className={clsx("text-2xl sm:text-3xl lg:text-4xl text-center font-black tracking-tight leading-tight", theme === "dark" ? "text-base-content" : "text-blue-950")}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-center text-primary text-base sm:text-lg font-medium">
                        {subtitle}
                    </p>
                )}
            </header>
        );
    }

    return (
        <header className="mb-6 md:mb-8">
            <div className="flex items-center gap-3">
                <span className="w-1 h-6 md:h-7 bg-primary rounded-full shrink-0" aria-hidden="true" />
                <h2 className={clsx("text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight", theme === "dark" ? "text-base-content" : "text-blue-950")}>
                    {title}
                </h2>
            </div>
            {subtitle && (
                <p className="mt-1.5 flex items-center gap-2 text-sm sm:text-base text-base-content/60 ml-4">
                    {Icon && <Icon className="text-primary text-base shrink-0" aria-hidden="true" />}
                    {subtitle}
                </p>
            )}
        </header>
    );
};

interface StampBadgeProps {
    icon: ElementType;
    className?: string;
}

export const StampBadge = ({ icon: Icon, className }: StampBadgeProps) => (
    <span
        className={clsx(
            "grid place-items-center rounded-full border-2 border-dashed border-current/40 p-2.5 shrink-0",
            className
        )}
    >
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
    </span>
);

export const HeroPill = ({
    icon,
    children,
}: {
    icon: ReactNode;
    children: ReactNode;
}) => (
    <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
        {icon}
        {children}
    </span>
);
