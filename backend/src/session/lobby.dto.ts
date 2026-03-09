export class CreateLobbyDto {
    playerName: string;
    quizId: string;
}

export class JoinLobbyDto {
    lobbyId: string;
    playerName: string;
}

export class StartGameDto {
    lobbyId: string;
}