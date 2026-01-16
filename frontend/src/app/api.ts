import type {UserData} from "../entities/types/UserData.ts";


export function postNewUser(userData:UserData):void {
    alert(userData.email + ' ' + userData.password)
}

export function getTokenUser(userData:UserData):void {
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
// export function getQuizs(pageNumber: number, limit: number) {
//     return fetch("http://localhost:4200/quiz").then(res => res.json())
// }

export function getQuizQuestion(id:string) {
    return fetch("http://localhost:4200/quiz/" + id).then(res => res.json())
}