import {type SubmitHandler, useForm} from "react-hook-form";
import type {IForm} from "../types/form.types.ts";
import styles from "../../pages/LoginPage.module.css";
import {ErrorMessage} from "../../shared/ui/ErrorMessage.tsx";
import {postNewUser} from "../../app/api.ts";


export function RegisterForm() {
    const {register, handleSubmit, formState} = useForm<IForm>({
            mode: 'onChange',
        }
    )
    const emailError = formState.errors['email']?.message
    const passwordError = formState.errors['password']?.message
    const nameError = formState.errors['name']?.message

    const onSubmit: SubmitHandler<IForm> = (data) => {
        postNewUser(data)

    }

    return (
        <form className={styles.login} onSubmit={handleSubmit(onSubmit)}>
            <p className={styles.form_title}>Регистрация</p>
            <input type="text"
                   placeholder="Введите ваше имя"
                   {...register("name", {
                       required: 'Обязательное поле',
                       pattern:{
                           value: /^[а-яА-ЯёЁa-zA-Z\s\-']+$/,
                           message: "Странное имя"
                       }
                   })} />
            {nameError && (
                <ErrorMessage textError={nameError}/>)}
            <input type="email"
                   placeholder="Почта"
                   {...register("email", {
                       required: 'Обязательное поле',
                       pattern:{
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
                       pattern:{
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
