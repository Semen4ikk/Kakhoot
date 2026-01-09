import {type SubmitHandler, useForm} from "react-hook-form";
import type {IForm} from "./types/form.types.ts";
import styles from "./Form.module.css"
import {ErrorMessage} from "../shared/ui/ErrorMessage.tsx";
import {getTokenUser} from "../app/api.ts";


export function AuthForm() {
    const {register, handleSubmit, formState} = useForm<IForm>({
            mode: 'onChange',
        }
    )
    const emailError = formState.errors['email']?.message
    const passwordError = formState.errors['password']?.message

    const onSubmit: SubmitHandler<IForm> = (data) => {
        getTokenUser(data)

    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <p className={styles.title}>Авторизация</p>
            <input type="email"
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
            <input type="password"
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
            <button type="submit">Login</button>
        </form>
    )
}
