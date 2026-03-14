import type {IForm} from "../widgets/types/form.types.ts";



export const postNewUser = async (data: IForm): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
}> => {
    const response = await fetch("http://localhost:4200/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка регистрации");
    }

    const responseData = await response.json();
    return responseData;
};

export function getUserData() {
    return fetch("http://localhost:4200/users/32").then(res => res.json())

}
export function getQuizs(pageNumber: number, limit: number) {
    const url = new URL('http://localhost:4200/quiz');
    url.searchParams.set('page', String(pageNumber));
    url.searchParams.set('limit', String(limit));

    return fetch(url.toString())
        .then(res => {
            if (!res.ok) {
                throw new Error('Ошибка при загрузке квизов');
            }
            return res.json();
        });
}

export function getQuizQuestion(id:string) {
    return fetch("http://localhost:4200/quiz/" + id).then(res => res.json())
}




export const userLogin = async (data: IForm): Promise<{ id: number; name: string; email: string }> => {
    const response = await fetch("http://localhost:4200/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Неверный email или пароль");
    }

    const responseData = await response.json();

    if (!responseData.user) {
        throw new Error("Некорректный формат ответа сервера");
    }

    return responseData.user;
};