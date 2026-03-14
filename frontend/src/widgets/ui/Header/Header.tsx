import styles from './Header.module.css'
import {UserName} from "../../../shared/ui/UserName.tsx";
import {Link} from "react-router-dom";
import type {UserData} from "../../../entities/types/UserData.ts";



export function Header() {
    const user: UserData | null  = JSON.parse(sessionStorage.getItem('user')!)
        ?? null;
    const handleLogOut = ()=>{
        sessionStorage.removeItem('user')
    }
    let exit: string = 'Выйти'
    if (user === null) {
        exit = 'Войти'
    }

    return(
        <header className={styles.header}>
            <div>
                <p>Joiny</p>
            </div>
            <div>
                <Link to="/lobby" >Играть с друзьями</Link>
                {user && <UserName user={user} />}
                <Link to="/login" onClick={handleLogOut}>{exit}</Link>
            </div>
        </header>
    )
}