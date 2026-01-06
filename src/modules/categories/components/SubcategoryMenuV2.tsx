import clsx from "clsx";
import { useState, useRef } from "react";
import type { SubcategoriesType } from "../CategoriesTypes";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../layouts/states/themeStore";

type Props = {
    data: SubcategoriesType[];
    onFindAncestors?: (subcategory_uuid: string) => void;
    rootID?: string;
    onDisabled?: boolean;
    queryParams: string;
};

const SubcategoryMenu = ({ data, onFindAncestors, onDisabled, queryParams }: Props) => {
    const { theme } = useThemeStore();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const hideTimeoutRef = useRef<number | null>(null);
    const navigate = useNavigate();

    const cancelHideTimeout = () => {
        if (hideTimeoutRef.current !== null) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    };

    const scheduleHide = (uuid: string) => {
        cancelHideTimeout();
        hideTimeoutRef.current = window.setTimeout(() => {
            setOpenItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(uuid);
                return newSet;
            });
        }, 300);
    };

    const handleMouseEnter = (uuid: string) => {
        cancelHideTimeout();
        setOpenItems(prev => new Set(prev).add(uuid));
        onFindAncestors && onFindAncestors(uuid);
    };

    const handleMouseLeave = (uuid: string) => {
        scheduleHide(uuid);
    };

    return (
        <ul className={clsx(
            "menu rounded-box w-19/20 text-base font-normal",
            theme === "ligth" ? "text-black" : "text-white",
            onDisabled ? "hidden" : "block"
        )}>
            {data.map(data => (
                <li key={`subcategory-${data.uuid}-lvl-${data.level}`}>
                    {data.children?.length ? (
                        <details
                            open={true}
                            onMouseEnter={() => handleMouseEnter(data.uuid)}
                            onMouseLeave={() => handleMouseLeave(data.uuid)}
                        >
                            <summary>{data.description}</summary>
                            <SubcategoryMenu data={data.children} onFindAncestors={onFindAncestors} queryParams={queryParams} />
                        </details>
                    ) : (
                        <a onMouseEnter={() => onFindAncestors && onFindAncestors(data.uuid)} onClick={() => navigate(`/tienda${queryParams}`)}>{data.description}</a>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default SubcategoryMenu;