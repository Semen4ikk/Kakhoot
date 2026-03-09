import { useState } from 'react';
import { useSessionSocket } from '../../../entities/session/hooks/useSessionSocket.tsx';

export const LobbyManager = () => {
    const { lobby, createLobby, joinLobby, startGame, isConnected } = useSessionSocket();

    const [playerName, setPlayerName] = useState('');
    const [quizId, setQuizId] = useState('');
    const [joinCode, setJoinCode] = useState('');

    // Форма создания
    const handleCreate = () => {
        if (!playerName || !quizId) return alert('Заполните имя и ID квиза');
        createLobby(playerName, quizId);
    };

    // Форма входа
    const handleJoin = () => {
        if (!joinCode || !playerName) return alert('Заполните код лобби и имя');
        joinLobby(joinCode, playerName);
    };

    // Отображение лобби
    if (lobby) {
        const isHost = lobby.players.find((p: any) => p.name === playerName)?.isHost;

        return (
            <div>
                <h2>Лобби: {lobby.id}</h2>
                <p>Квиз ID: {lobby.quizId}</p>
                <p>Статус: <strong>{lobby.status}</strong></p>

                <h3>Игроки ({lobby.players.length}):</h3>
                <ul>
                    {lobby.players.map((p: any, i: number) => (
                        <li key={i}>
                            {p.name} {p.isHost && '(Хост)'}
                        </li>
                    ))}
                </ul>

                {lobby.status === 'waiting' && isHost && (
                    <button onClick={() => startGame(lobby.id)}>
                        Начать игру
                    </button>
                )}

                {lobby.status === 'playing' && (
                    <div className="game-active">
                        Игра идёт! Ожидайте вопрос...
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <h1>Квиз Сессии</h1>

            <input
                placeholder="Ваше имя"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
            />
            <div style={{ border: '1px solid #ccc', padding: 16, margin: 10 }}>
                <h3>Создать лобби</h3>
                <input
                    placeholder="ID Квиза"
                    type="number"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                />
                <button onClick={handleCreate} disabled={!isConnected}>
                    Создать
                </button>
            </div>
            <div style={{ border: '1px solid #ccc', padding: 16, margin: 10 }}>
                <h3>Войти в лобби</h3>
                <input
                    placeholder="Код лобби"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    style={{ textTransform: 'uppercase' }}
                />
                <button onClick={handleJoin} disabled={!isConnected}>
                    Войти
                </button>
            </div>
        </div>
    );
};