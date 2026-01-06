import clsx from "clsx";
import type { SubcategoriesType } from "../CategoriesTypes";

type Props = {
    data: SubcategoriesType[];
    onFindAncestors?: (subcategory_uuid: string) => void;
    rootID?: number;
    onDisabled?: boolean;
}

const SubcategoryMenu = ({ data, onFindAncestors, onDisabled }: Props) => {
    return (
        <ul className={clsx(
            "menu rounded-box w-19/20 text-base font-normal",
            onDisabled ? "hidden" : "block"
        )}>
            {data.map(data => (
                <li key={`subcategory-uuid-${data.uuid}-father-${data.father_uuid}`}>
                    {data.children?.length ? (
                        <details>
                            <summary onClick={() => onFindAncestors && onFindAncestors(data.uuid)}>{data.description}</summary>
                            <SubcategoryMenu data={data.children} onFindAncestors={onFindAncestors} />
                        </details>
                    ) : (
                        <a onClick={() => onFindAncestors && onFindAncestors(data.uuid)}>{data.description}</a>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default SubcategoryMenu;