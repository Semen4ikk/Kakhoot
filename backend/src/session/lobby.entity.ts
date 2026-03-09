export interface Player {
    id: string;
    name: string;
    score: number;
    isHost: boolean;
    socketId: string;
}

export enum LobbyStatus {
    WAITING = 'waiting',
    PLAYING = 'playing',
    FINISHED = 'finished',
}

export interface Lobby {
    id: string;
    quizId: string;
    hostId: string;
    players: Player[];
    status: LobbyStatus;
    currentQuestionIndex: number;
    answers: Record<string, number>;
    createdAt: number;
}