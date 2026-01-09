import {useEffect, useState} from "react";
import {getUserData} from "../../app/api.ts";

export function useUserName() {
    const [userName, setUserName] = useState<string>("Загрузка");

    console.log(userName);
    useEffect(() => {


        getUserData().then(json => setUserName(json.name))

    }, [])
    return userName;
}