import {useUserName} from "../../entities/user/hooks/useUserName.tsx";

export function UserName() {

    return(
        <div>
            <span>{useUserName()}</span>
        </div>
    )
}
