import {useUserName} from "../../entities/user/model/useUserName.tsx";

export function UserName() {

    return(
        <div>
            <span>{useUserName()}</span>
        </div>
    )
}
