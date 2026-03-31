import {useNavigate} from "react-router-dom";
import styles from "./BackMainButton.module.css"

interface BackMainButtonProps {
    Leave?: () => void;
}
export function BackMainButton({ Leave }: BackMainButtonProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        Leave?.();
        navigate('/main')
    };
    return (
        <button
            type="button"
            className={styles.button}
            onClick={handleClick}
        >
            Назад к списку
        </button>
    )
}