import { useCallback, useEffect, useRef, useState } from "react";


interface UseMediaLoadignProps {
    speed?: number;
    completionDelay?: number;
}

export function useMediaLoading ({speed = 400, completionDelay = 450}: UseMediaLoadignProps ={}) {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const intervalRef = useRef<number | null>(null);

    const startLoading = useCallback(() => {
        setProgress(0);
        setIsLoading(true);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = window.setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;

                // Desacelera conforme aproxima de 90%
                const increment = Math.max(1, (90 - prev) * 0.08);

                return Math.min(prev + increment, 90);
            });
        }, speed);
    }, [speed]);

    const completeLoading = useCallback(() => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setProgress(100);

        setTimeout(() => {
            setIsLoading(false);
        }, completionDelay)
    }, [completionDelay]);

    const reset = useCallback(() => {
        startLoading();
    }, [startLoading]);

    useEffect(() => {
        startLoading();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [startLoading]);

    return {
        progress,
        isLoading,
        completeLoading,
        reset,
    };
}