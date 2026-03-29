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
    code: string;
    quizId: string;
    quizName?: string;
    hostId: string;
    players: Player[];
    status: LobbyStatus;
    questions: any[];
    currentQuestionIndex: number;
    answers: Record<string, string>;
    createdAt: number;
}