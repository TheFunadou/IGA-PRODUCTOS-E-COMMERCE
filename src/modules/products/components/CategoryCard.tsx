import { Link } from "react-router-dom";

type CategoryCardProps = {
    className?: string;
    title: string;
    images: string[];
    linkText: string;
}

const CategoryCard = ({ className = '', title, images, linkText }: CategoryCardProps) => {
    return (
        <div className={`${className} p-4 bg-base-100 rounded-lg shadow-xl flex-shrink-0 w-100 h-125 border border-gray-300`}>
            <p className="text-center text-2xl font-semibold mb-3 text-gray-800">{title}</p>

            {/* Grid de 4 imágenes */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {images.map((image, index) => (
                    <div key={index} className="w-full rounded-md overflow-hidden flex items-center justify-center">
                        <img
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full h-full rounded-md object-contain hover:scale-105 transition-transform duration-200 border border-gray-300"
                        />
                    </div>
                ))}
            </div>

            <Link to={"tienda/"}>{linkText}</Link>
        </div>
    );
};


export default CategoryCard;