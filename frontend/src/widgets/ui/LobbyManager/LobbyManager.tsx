import { useState } from 'react';

import {MultiplayerQuiz} from "../MultiplayerQuiz/MultiplayerQuiz.tsx";
import {useSessionSocket} from "../../../entities/session/SessionContext.tsx";

export const LobbyManager = () => {
    const { lobby, gameState, createLobby, joinLobby, startGame, isConnected, leaveLobby, playerName, setPlayerName } = useSessionSocket();
    const [quizId, setQuizId] = useState('');
    const [joinCode, setJoinCode] = useState('');

    if (gameState?.isActive) {
        return <MultiplayerQuiz />;
    }

    if (lobby) {
        const isHost = lobby.players.find((p: any) => p.name === playerName)?.isHost;
        const lobbyCode = lobby.code || lobby.id || lobby.lobbyCode || '—';

        return (
            <div className="lobby-container">
                <button onClick={leaveLobby} className="lobby-leave-btn">← Выйти из лобби</button>

                <div className="lobby-info-card">
                    <h2 className="lobby-title">
                        Лобби: <span className="lobby-code">{lobbyCode}</span>
                    </h2>
                    <p className="lobby-quiz-id">Квиз ID: {lobby.quizId}</p>
                    <p className="lobby-status">Статус: <strong>{lobby.status}</strong></p>
                </div>

                <h3 className="players-title">Игроки ({lobby.players.length}):</h3>
                <ul className="players-list">
                    {lobby.players.map((p: any, i: number) => (
                        <li key={i} className="player-item">
                            {p.name} {p.isHost && <span className="player-badge">Организатор</span>} {p.name === playerName && <span className="player-badge player-badge--me">Вы</span>}
                        </li>
                    ))}
                </ul>

                {lobby.status === 'waiting' && isHost && (
                    <button
                        onClick={() => startGame(lobby.id)}
                        className="lobby-start-btn"
                    >
                        Начать игру для всех
                    </button>
                )}

                {lobby.status === 'waiting' && !isHost && (
                    <p className="lobby-waiting-text">Ожидайте, пока организатор начнет игру...</p>
                )}
            </div>
        );
    }

    return (
        <div className="lobby-entry">
            <h1 className="lobby-entry-title">Мультиплеер Квиз</h1>

            <input
                placeholder="Ваше имя"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="lobby-input"
            />

            <div className="lobby-section">
                <h3 className="lobby-section-title">Создать лобби</h3>
                <input
                    placeholder="ID Квиза"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className="lobby-input"
                />
                <button onClick={() => createLobby(playerName, quizId)} disabled={!isConnected} className="lobby-btn">
                    Создать
                </button>
            </div>

            <div className="lobby-section">
                <h3 className="lobby-section-title">Войти в лобби</h3>
                <input
                    placeholder="Код лобби"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="lobby-input lobby-input--code"
                />
                <button onClick={() => joinLobby(joinCode, playerName)} disabled={!isConnected} className="lobby-btn">
                    Войти
                </button>
            </div>
        </div>
    );
};