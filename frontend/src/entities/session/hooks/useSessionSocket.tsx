// hooks/useSessionSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSessionSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobby, setLobby] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Подключаемся к неймспейсу /sessions
        const newSocket = io('http://localhost:4200/sessions', {
            transports: ['websocket','polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Слушаем события
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

        // Очистка при размонтировании
        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Создать лобби
    const createLobby = (playerName: string, quizId: string) => {
        socket?.emit('create_lobby', { playerName, quizId });
    };

    // Присоединиться к лобби
    const joinLobby = (lobbyId: string, playerName: string) => {
        socket?.emit('join_lobby', { lobbyId, playerName });
    };

    // Начать игру (только хост)
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