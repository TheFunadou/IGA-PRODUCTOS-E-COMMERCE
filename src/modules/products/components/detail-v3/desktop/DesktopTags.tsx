import { FaTag } from "react-icons/fa6";
import type { PV3TagData } from "../../../ProductTypes";

/* Tags (solo desktop, arriba del layout) */
const DesktopTags = ({ tags }: { tags: PV3TagData[] }) => (
    <>
        {tags.length > 0 && (
            <div className="hidden lg:flex flex-wrap items-center gap-1.5 mb-5">
                {tags.map(tag => (
                    <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-base-200/60 text-base-content/70 border border-base-300 cursor-default"
                        title={`Tier ${tag.tier}`}
                    >
                        <FaTag className="text-[9px] text-primary/70" />
                        {tag.name}
                    </span>
                ))}
            </div>
        )}
    </>
);

export default DesktopTags;
