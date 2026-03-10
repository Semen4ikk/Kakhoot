import styles from './Header.module.css'
import {UserName} from "../../../shared/ui/UserName.tsx";
import {Link} from "react-router-dom";


export function Header() {

    return(
        <header className={styles.header}>
            <div>
                <p>Joiny</p>
            </div>
            <div>
                <Link to="/lobby" >Играть с друзьями</Link>
                <UserName/>
                <Link to="/login" >Выйти</Link>
            </div>
        </header>
    )
}