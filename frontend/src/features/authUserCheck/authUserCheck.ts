export function authUserCheck() {
    return sessionStorage.getItem('user') !== null;
}