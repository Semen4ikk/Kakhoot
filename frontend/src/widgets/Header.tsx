import styles from './Header.module.css'
import {UserName} from "../shared/ui/UserName.tsx";


export function Header() {

    return(
        <header className={styles.header}>
            <div>
                <p>Joiny</p>
            </div>
            <div>
                <UserName/>
                <button>Выйти</button>
            </div>
        </header>
    )
}