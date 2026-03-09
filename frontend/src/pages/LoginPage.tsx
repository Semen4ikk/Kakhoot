import {AuthForm} from "../widgets/ui/Auth/AuthForm.tsx";
import styles from './LoginPage.module.css'
export function LoginPage() {

    return (
        <div className={styles.form}>
            <AuthForm/>
        </div>
    )
}