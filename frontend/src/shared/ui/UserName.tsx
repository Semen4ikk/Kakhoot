import {useUserName} from "../hooks/useUserName.tsx";

export function UserName() {

    return(
        <div>
            <span>{useUserName()}</span>
        </div>
    )
}
