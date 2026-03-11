interface UserData {
    name: string,
    email: string,
    password: string,
}
interface UserNameProps {
    user: UserData;
}

export function UserName({ user }: UserNameProps) {

    return(
        <div>
            <span>{user.name}</span>
        </div>
    )
}
