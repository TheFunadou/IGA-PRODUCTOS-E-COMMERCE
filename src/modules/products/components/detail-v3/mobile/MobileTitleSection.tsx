import type { PV3TagData } from "../../../ProductTypes";
import TagsScrollRow from "../../TagsScrollRow";

/* Título + tags deslizables + rating (solo mobile, <lg) */
interface MobileTitleSectionProps {
    name: string;
    tags: PV3TagData[];
    ratingBlock: React.ReactNode;
}

const MobileTitleSection = ({ name, tags, ratingBlock }: MobileTitleSectionProps) => (
    <>
        {/* Título (mobile): ahora por encima de las etiquetas */}
        <h1 className="lg:hidden text-base font-black leading-tight tracking-tight text-base-content mb-2 break-words">
            {name}
        </h1>

        {/* Tags (mobile): 1 sola fila deslizable bajo el nombre (TagsScrollRow
            incluye el peek + fade degradado en el borde derecho) */}
        {tags.length > 0 && (
            <div className="my-1 lg:hidden">
                <TagsScrollRow tags={tags} />
            </div>
        )}

        {/* Rating (mobile): bajo el nombre; el SKU ahora vive como badge sobre la imagen */}
        <div className="lg:hidden mb-4">
            {ratingBlock}
        </div>
    </>
);

export default MobileTitleSection;
