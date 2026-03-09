// hooks/useSessionSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSessionSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobby, setLobby] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:4200/sessions', {
            transports: ['websocket','polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('lobby_created', (data) => {
            setLobby(data);
            setError(null);
        });

        newSocket.on('lobby_updated', (data) => {
            setLobby(data);
        });

        newSocket.on('game_started', (data) => {
            setLobby({ ...lobby, status: 'playing', ...data });
        });

        newSocket.on('error', (err) => {
            setError(err.message);
            console.error('Socket error:', err);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const createLobby = (playerName: string, quizId: string) => {
        socket?.emit('create_lobby', { playerName, quizId });
    };

    const joinLobby = (lobbyId: string, playerName: string) => {
        socket?.emit('join_lobby', { lobbyId, playerName });
    };

    const startGame = (lobbyId: string) => {
        socket?.emit('start_game', { lobbyId });
    };

    return {
        socket,
        lobby,
        error,
        createLobby,
        joinLobby,
        startGame,
        isConnected: socket?.connected || false,
    };
};