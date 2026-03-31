import {LobbyManager} from "../../widgets/ui/LobbyManager/LobbyManager.tsx";
import {Header} from "../../widgets/ui/Header/Header.tsx";
import styles from "./LobbyPage.module.css"
export function LobbyPage(){
    return (
        <>
            <Header />
            <div className={styles.lobbyPage}>
                <LobbyManager/>
            </div>

        </>

    )
}