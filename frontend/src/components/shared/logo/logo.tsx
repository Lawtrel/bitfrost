import styles from './Logo.module.css'

interface LogoProps {
    size: number;
    isLazy?: boolean;
}

export default function Logo ({size, isLazy = false}: LogoProps) {
    return (
        <div className={`${styles['shine-effect']} ${styles.logo}`}>
            <img loading={isLazy ? 'lazy' : 'eager'} style={{ width: `${size}rem`, height: `${size}rem` }} src="/assets/Logo Bifrost.png" alt="Bifrost Logo" />
        </div>
    )
}