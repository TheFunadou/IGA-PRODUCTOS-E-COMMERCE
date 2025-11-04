import React, { useState, useRef } from 'react';

type Props = {
    src: string | undefined;
    alt: string | undefined;
}

const ImageMagnifier = ({ src, alt }: Props) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef<HTMLDivElement>(null);

    const magnifierSize = 150;
    const zoomLevel = 2.5;

    const handleMouseEnter = () => {
        setShowMagnifier(true);
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imgRef.current) return;

        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setCursorPosition({ x, y });
        setMagnifierPosition({ x, y });
    };

    const imgRect = imgRef.current?.getBoundingClientRect();
    const imgWidth = imgRect?.width || 0;
    const imgHeight = imgRect?.height || 0;

    return (
        <div className="inline-block w-full h-full">
            <div
                ref={imgRef}
                className="relative overflow-hidden rounded-xl border-2 border-gray-300 cursor-crosshair w-full h-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover rounded-xl"
                    draggable={false}
                />

                {showMagnifier && (
                    <div
                        className="absolute border-4 border-white rounded-full pointer-events-none shadow-2xl"
                        style={{
                            width: `${magnifierSize}px`,
                            height: `${magnifierSize}px`,
                            left: `${magnifierPosition.x - magnifierSize / 2}px`,
                            top: `${magnifierPosition.y - magnifierSize / 2}px`,
                            backgroundImage: `url(${src})`,
                            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                            backgroundPositionX: `-${cursorPosition.x * zoomLevel - magnifierSize / 2}px`,
                            backgroundPositionY: `-${cursorPosition.y * zoomLevel - magnifierSize / 2}px`,
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageMagnifier;


// export default function App() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
//       <div className="w-full max-w-3xl h-96">
//         <ImageMagnifier
//           src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
//         />
//       </div>
//     </div>
//   );
// }