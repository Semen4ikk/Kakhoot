import type {UserData} from "../entities/types/UserData.ts";
import type {IForm} from "../widgets/types/form.types.ts";


export function postNewUser(userData:UserData):void {
    alert(userData.email + ' ' + userData.password)
}

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
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Неверный email или пароль");
    }

    return response.json();
};