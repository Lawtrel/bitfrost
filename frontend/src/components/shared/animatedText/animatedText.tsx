import styles from './animatedText.module.css';
import { useRotatingText } from "@/hooks/rotatingText/useRotatingText";

interface AnimatedTextProps {
    interval?: number;
    items?: string[];
}

export default function AnimatedText({ interval = 4000, items}: AnimatedTextProps) {
    const currentMessages = useRotatingText({ items, interval });
    return (
        <span key={currentMessages} className={styles['fade-up'] + ' text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'} >
            {items[currentMessages]}
        </span>
    )
}