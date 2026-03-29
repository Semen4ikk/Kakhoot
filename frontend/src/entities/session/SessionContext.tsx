import { createContext, useContext, useEffect, useState,type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type {IQuizQuestion} from "../../widgets/types/Quiz.ts";


interface GameState {
    isActive: boolean;
    currentQuestion: IQuizQuestion | null;
    questionIndex: number;
    totalQuestions: number;
    leaderboard: { name: string; score: number }[];
    isFinished: boolean;
    correctAnswer: string | null;
    isAnswered: boolean;
}

interface SessionContextType {
    socket: Socket | null;
    lobby: any;
    gameState: GameState | null;
    error: string | null;
    playerName: string;
    setPlayerName: (name: string) => void;
    createLobby: (playerName: string, quizId: string) => void;
    joinLobby: (lobbyId: string, playerName: string) => void;
    startGame: (lobbyId: string) => void;
    sendAnswer: (answer: string) => void;
    leaveLobby: () => void;
    isConnected: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobby, setLobby] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [playerName, setPlayerName] = useState<string>('');

    useEffect(() => {
        const newSocket = io('http://localhost:4200/sessions', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setError(null);
        });

        newSocket.on('connect_error', (err) => {
            setError(err.message);
            setIsConnected(false);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('lobby_created', (data) => {
            setLobby(data);
            setError(null);
        });

        newSocket.on('lobby_updated', (data) => {
            setLobby(data);
        });

        newSocket.on('game_started', (data) => {
            setLobby((prev: any) => ({ ...prev, status: 'playing', ...data }));
            setGameState({
                isActive: true,
                currentQuestion: null,
                questionIndex: 0,
                totalQuestions: data.totalQuestions || 0,
                leaderboard: [],
                isFinished: false,
                correctAnswer: null,
                isAnswered: false,
            });
        });

        newSocket.on('game_question', (data) => {
            setGameState((prev) => {
                if (!prev) {
                    return {
                        isActive: true,
                        currentQuestion: data.question,
                        questionIndex: data.index,
                        totalQuestions: 0,
                        leaderboard: [],
                        isFinished: false,
                        correctAnswer: null,
                        isAnswered: false,
                    };
                }
                return {
                    ...prev,
                    currentQuestion: data.question,
                    questionIndex: data.index,
                    correctAnswer: null,
                    isAnswered: false,
                };
            });
        });

        newSocket.on('game_answer_result', (data) => {
            console.log('📊 game_answer_result received:', data);
            setGameState((prev) => {
                if (!prev) {
                    console.warn('⚠️ gameState is null when receiving game_answer_result');
                    return null;
                }
                const newState = {
                    ...prev,
                    leaderboard: data.leaderboard,
                    correctAnswer: data.correctAnswer,
                    isAnswered: true,
                };
                console.log('📊 New gameState with correctAnswer:', newState.correctAnswer);
                return newState;
            });
        });

        newSocket.on('game_leaderboard', (data) => {
            setGameState((prev) => {
                if (!prev) return null;
                return { ...prev, leaderboard: data };
            });
        });

        newSocket.on('game_over', (data) => {
            setGameState((prev) => {
                if (!prev) return null;
                return { ...prev, isFinished: true, leaderboard: data.leaderboard || data };
            });
        });

        newSocket.on('error', (err) => {
            setError(err.message);
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('connect');
            newSocket.off('connect_error');
            newSocket.off('disconnect');
            newSocket.off('lobby_created');
            newSocket.off('lobby_updated');
            newSocket.off('game_started');
            newSocket.off('game_question');
            newSocket.off('game_answer_result');
            newSocket.off('game_leaderboard');
            newSocket.off('game_over');
            newSocket.off('error');
            newSocket.disconnect();
        };
    }, []);

    const createLobby = (name: string, quizId: string) => {
        setPlayerName(name);
        socket?.emit('create_lobby', { playerName: name, quizId });
    };

    const joinLobby = (lobbyId: string, name: string) => {
        setPlayerName(name);
        socket?.emit('join_lobby', { lobbyId, playerName: name });
    };

    const startGame = (lobbyId: string) => {
        socket?.emit('start_game', { lobbyId });
    };

    const sendAnswer = (answer: string) => {
        console.log('📤 sendAnswer called with:', answer);
        socket?.emit('game_answer', { answer });
    };

    const leaveLobby = () => {
        socket?.emit('leave_lobby');
        setLobby(null);
        setGameState(null);
    };

    return (
        <SessionContext.Provider value={{
            socket,
            lobby,
            gameState,
            error,
            playerName,
            setPlayerName,
            createLobby,
            joinLobby,
            startGame,
            sendAnswer,
            leaveLobby,
            isConnected,
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionSocket = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSessionSocket must be used within a SessionProvider');
    }
    return context;
};