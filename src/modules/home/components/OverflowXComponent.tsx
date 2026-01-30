import React, { useRef, useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

interface OverflowXComponentProps {
    children: React.ReactNode;
    className?: string;
}

export const OverflowXComponent: React.FC<OverflowXComponentProps> = ({
    children,
    className = ''
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative w-full">
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary shadow-lg rounded-full p-2 hover:bg-info"
                    aria-label="Scroll left"
                >
                    <FaArrowLeft className="w-7 h-7 text-white" />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className={`w-full flex overflow-x-auto scrollbar-hide ${className}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary shadow-lg rounded-full p-2 hover:bg-info"
                    aria-label="Scroll right"
                >
                    <FaArrowRight className="w-7 h-7 text-white" />
                </button>
            )}
        </div>
    );
};