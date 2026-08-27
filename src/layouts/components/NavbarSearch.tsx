import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaTrash, FaX } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import clsx from "clsx";
import useDebounce from "../../global/hooks/useDebounce";
import { useShopProducts } from "../../modules/shop/hooks/useShopProducts";
import { useOutsideSearchClick } from "../../modules/products/hooks/useOutsideSearchClick";
import { makeSlug } from "../../modules/products/Helpers";
import type { PV3CardData } from "../../modules/products/ProductTypes";
import { useSearchHistoryStore } from "../states/searchCachedStore";
import { trackSearch } from "../../modules/analytics/MetaEvents";

interface NavbarSearchProps {
    variant: "desktop" | "mobile";
}

const NavbarSearch = ({ variant }: NavbarSearchProps) => {
    const isDesktop = variant === "desktop";
    const navigate = useNavigate();

    const { searches: searchHistory, addSearch, clearSearches } = useSearchHistoryStore();
    const [isInputActive, setIsInputActive] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const debouncedValue = useDebounce(inputValue, 300);
    const trimmedQuery = debouncedValue.trim();
    const canSearch = trimmedQuery.length >= 3;

    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideSearchClick(dropdownRef, () => setShowResults(false));

    const { data, isLoading } = useShopProducts({
        search: debouncedValue,
        itemsPerPage: 6,
        enabled: canSearch,
    });

    useEffect(() => {
        if (canSearch && data && data.data.length > 0) {
            trackSearch(trimmedQuery, data.totalRecords);
        }
    }, [canSearch, trimmedQuery, data]);

    const isSearching = inputValue.trim() !== trimmedQuery || isLoading;
    const showHistoryDropdown = isInputActive && inputValue.trim().length === 0 && searchHistory.length > 0;
    const showResultsDropdown = showResults && canSearch && !!data;

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setShowResults(true);
    };

    const handleClearInput = (e: React.MouseEvent) => {
        e.preventDefault();
        setInputValue("");
        setShowResults(false);
    };

    const handleHistorySelect = (e: React.MouseEvent, search: string) => {
        e.preventDefault();
        handleInputChange(search);
    };

    const handleResultClick = (card: PV3CardData) => {
        addSearch(inputValue.trim());
        setShowResults(false);
        setInputValue("");
        navigate(
            `/tienda/${card.product.category.name.toLowerCase()}/${makeSlug(card.product.product_name)}/${card.version.sku.toLowerCase()}`
        );
    };

    return (
        <div className={clsx("relative", isDesktop ? "hidden lg:flex flex-1 min-w-0" : "w-full")}>
            {/* Input */}
            <div
                className={clsx(
                    "flex items-center w-full gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 transition-colors",
                    isDesktop ? "focus-within:border-white/60" : "focus-within:border-white/50"
                )}
            >
                {isSearching
                    ? <span className="loading loading-dots loading-xs text-white shrink-0" />
                    : <FaSearch className="text-white/50 text-sm shrink-0" />
                }
                <input
                    type="text"
                    className="flex-1 bg-transparent text-white placeholder-white/40 text-sm outline-none min-w-0"
                    placeholder="Buscar productos..."
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsInputActive(true)}
                    onBlur={() => setIsInputActive(false)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
                {inputValue.length > 0 && (
                    <button
                        type="button"
                        onMouseDown={handleClearInput}
                        aria-label="Limpiar búsqueda"
                        className="text-white/40 hover:text-white text-xs shrink-0 p-1"
                    >
                        <FaX />
                    </button>
                )}
            </div>

            {/* Dropdown historial */}
            {showHistoryDropdown && (
                <div
                    ref={dropdownRef}
                    className={clsx(
                        "absolute top-full mt-2 bg-base-100 border border-base-300 rounded-xl shadow-xl z-60 overflow-hidden",
                        isDesktop ? "w-full" : "left-0 right-0 mx-4"
                    )}
                >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-base-200">
                        <span className="text-xs font-semibold uppercase text-base-content/40">Búsquedas recientes</span>
                        <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); clearSearches(); }}
                            className="flex items-center gap-1 text-xs text-error hover:underline"
                        >
                            <FaTrash size={10} /> Limpiar
                        </button>
                    </div>
                    {searchHistory.map((data, index) => (
                        <button
                            key={`${index}-${data}`}
                            type="button"
                            onMouseDown={(e) => handleHistorySelect(e, data)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-base-200 text-left transition-colors"
                        >
                            <FaClock size={14} className="text-base-content/30 shrink-0" />
                            <span className="text-sm text-base-content">{data}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Dropdown resultados */}
            {showResultsDropdown && (
                <div
                    ref={dropdownRef}
                    className={clsx(
                        "absolute top-full mt-2 bg-base-100 border border-base-300 rounded-xl shadow-xl z-60 overflow-hidden",
                        isDesktop ? "w-full" : "left-0 right-0 mx-4"
                    )}
                >
                    {data.data.length === 0 ? (
                        <div className="flex items-center gap-2.5 px-4 py-4">
                            <FaBoxOpen className="text-base-content/25 shrink-0" />
                            <p className="text-sm text-base-content/50 truncate">
                                Sin resultados para <span className="font-semibold text-base-content/70">«{trimmedQuery}»</span>
                            </p>
                        </div>
                    ) : (
                        <ul className="max-h-[60vh] overflow-y-auto divide-y divide-base-200/70">
                            {data.data.map((card) => (
                                <li key={card.version.sku}>
                                    <button
                                        type="button"
                                        onClick={() => handleResultClick(card)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-base-200/80 text-left transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-base-200 shrink-0 overflow-hidden flex items-center justify-center">
                                            {card.version.image_url ? (
                                                <img
                                                    src={card.version.image_url}
                                                    alt={card.product.product_name}
                                                    loading="lazy"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <FaBoxOpen className="text-lg text-base-content/25" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-base-content line-clamp-1 leading-snug">
                                                {card.product.product_name}
                                            </span>
                                            <span className="text-xs text-base-content/60 truncate">{card.version.color_name}</span>
                                            <span className="text-[11px] font-mono text-base-content/40 truncate">SKU: {card.version.sku}</span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default NavbarSearch;
