import clsx from "clsx";
import { FaFileLines } from "react-icons/fa6";

/* Tabs técnicos (Descripción / Características / ...) con tablist con scroll-x
   interno y contenido en prose. Compartido por mobile y desktop. */
interface DetailTabsProps {
    availableTabs: { label: string; content: string }[];
    activeTab: number;
    onSelectTab: (i: number) => void;
}

const DetailTabs = ({ availableTabs, activeTab, onSelectTab }: DetailTabsProps) => (
    <>
        {availableTabs.length > 0 ? (
            <>
                {/* Tablist con scroll-x interno: con 4 tabs los labels no caben en
                    viewports angostos (~359px en móvil de 375px) y desbordaban el
                    ancho de la página; shrink-0 evita que los botones se compriman */}
                <div role="tablist" className="tabs tabs-box bg-base-200/50 border border-base-200 p-1 w-fit max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {availableTabs.map(({ label }, i) => (
                        <button
                            key={i}
                            role="tab"
                            type="button"
                            onClick={() => onSelectTab(i)}
                            className={clsx(
                                "tab shrink-0 font-bold text-xs sm:text-sm h-8 min-h-0 rounded-lg",
                                activeTab === i ? "tab-active bg-base-100 text-primary shadow-sm" : "text-base-content/50"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="pt-5">
                    <div className="prose prose-sm max-w-none break-words text-base-content/80 text-justify">
                        {availableTabs[Math.min(activeTab, availableTabs.length - 1)].content
                            .split('\n')
                            .filter(p => p.trim().length > 0)
                            .map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-36 bg-base-200/30 rounded-xl border border-dashed border-base-300 text-base-content/40 gap-3">
                <FaFileLines className="text-4xl opacity-30" />
                <p className="font-bold text-sm">No hay información adicional de este producto</p>
            </div>
        )}
    </>
);

export default DetailTabs;
