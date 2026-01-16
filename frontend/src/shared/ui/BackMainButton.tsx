import {useNavigate} from "react-router-dom";

export function BackMainButton(){
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate('/main')}
        >
            Назад к списку
        </button>
    )
}