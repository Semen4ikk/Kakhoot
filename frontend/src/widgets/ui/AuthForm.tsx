import {type SubmitHandler, useForm} from "react-hook-form";
import type {IForm} from "../types/form.types.ts";
import styles from "./AuthForm.module.css"
import {ErrorMessage} from "../../shared/ui/ErrorMessage.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {userLogin} from "../../app/api.ts";


export function AuthForm() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const {register, handleSubmit, formState} = useForm<IForm>({
            mode: 'onChange',
        }
    )
    const emailError = formState.errors['email']?.message
    const passwordError = formState.errors['password']?.message

    const onSubmit: SubmitHandler<IForm> = async (data) => {
        try {
            setServerError(null);
            const user = await userLogin(data);

            localStorage.setItem('user', JSON.stringify(user));

            navigate('/main');
        } catch (err) {
            if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError('Ошибка авторизации');
            }
        }

    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <p className={styles.title}>Авторизация</p>
            <input className={styles.input} type="email"
                   placeholder="Почта"
                   {...register("email", {
                       required: 'Обязательное поле',
                       pattern: {
                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                           message: "Инвалид на почте"
                       }
                   })} />
            {emailError && (
                <ErrorMessage textError={emailError}/>)}
            <input className={styles.input} type="password"
                   placeholder="Пароль"
                   {...register("password", {
                       required: 'Обязательное поле',
                       pattern: {
                           value: /.{8,}/,
                           message: "не корректный пароль"
                       }
                   })}
            />
            {passwordError && (
                <ErrorMessage textError={passwordError}/>
            )}
            {serverError && (
                <div className={styles.serverError}>
                    <ErrorMessage textError={serverError} />
                </div>
            )}
            <button className={styles.button} type="submit">Login</button>
        </form>
    )
}
