import { type SubmitHandler, useForm } from "react-hook-form";
import type { IForm } from "../../types/form.types.ts";
import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import { postNewUser } from "../../../app/api.ts";
import { ErrorMessage } from "../../../shared/ui/ErrorMessage.tsx";
import styles from './RegistrationForm.module.css'

export function RegisterForm() {
    const navigate = useNavigate();

    // ✅ ДОБАВЛЕНО: состояние для отображения ошибок от сервера
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState } = useForm<IForm>({
        mode: 'onChange',
    })

    const emailError = formState.errors['email']?.message
    const passwordError = formState.errors['password']?.message
    const nameError = formState.errors['name']?.message

    const onSubmit: SubmitHandler<IForm> = async (data) => {
        try {
            setServerError(null);

            const user = await postNewUser(data);

            sessionStorage.setItem('user', JSON.stringify(user));
            navigate('/main');

        } catch (err) {
            if (err instanceof Error) {
                setServerError(err.message);
            } else {
                setServerError('Ошибка регистрации');
            }
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <p className={styles.title}>Регистрация</p>
            <input className={styles.input} type="text"
                   placeholder="Введите ваше имя"
                   {...register("name", {
                       required: 'Обязательное поле',
                       pattern: {
                           value: /^[а-яА-ЯёЁa-zA-Z\s\-']+$/,
                           message: "Странное имя"
                       }
                   })} />
            {nameError && <ErrorMessage textError={nameError} />}

            <input className={styles.input} type="email"
                   placeholder="Почта"
                   {...register("email", {
                       required: 'Обязательное поле',
                       pattern: {
                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                           message: "Инвалид на почте"
                       }
                   })} />
            {emailError && <ErrorMessage textError={emailError} />}

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
            {passwordError && <ErrorMessage textError={passwordError} />}

            {serverError && (
                <div className={styles.serverError}>
                    <ErrorMessage textError={serverError} />
                </div>
            )}
            <div className={styles.div}>
                <Link to="/login" className={styles.Linker}>Войти?</Link>
                <button className={styles.button} type="submit">Регистрация</button>
            </div>

        </form>
    )
}