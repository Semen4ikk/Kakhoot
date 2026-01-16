import type {UserData} from "../entities/types/UserData.ts";


export function postNewUser(userData:UserData):void {
    alert(userData.email + ' ' + userData.password)
}

export function getTokenUser(userData:UserData):void {
    alert(userData.email + ' ' + userData.password)
}

export function getUserData() {
    return fetch("http://localhost:4200/users/28").then(res => res.json())

}

export function getQuizs() {
    return fetch("http://localhost:4200/quiz").then(res => res.json())
}

export function getQuizQuestion(id:string) {
    return fetch("http://localhost:4200/quiz/" + id).then(res => res.json())
}