import {RegisterForm} from "../../widgets/ui/Register/RegisterForm.tsx";
import styles from './RegistrationPage.module.css'
import {Header} from "../../widgets/ui/Header/Header.tsx";
export function RegistrationPage() {

    return(
        <>
            <Header/>
            <div className={styles.form}>
                <RegisterForm/>
            </div>
        </>

    )
}




