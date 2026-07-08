import { useEffect, useState } from "react";

interface UseRotatingTextProps {
    items: string[]
    interval?: number;
}

export function useRotatingText({ items, interval = 4000 }: UseRotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if(items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

        return () => clearInterval(timer);
    }, [items, interval]);

    return  currentIndex ;
}