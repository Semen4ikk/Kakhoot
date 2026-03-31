import { useState } from 'react';
import { MultiplayerQuiz } from "../MultiplayerQuiz/MultiplayerQuiz.tsx";
import { useSessionSocket } from "../../../entities/session/SessionContext.tsx";
import styles from "./LobbyManager.module.css";

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

            <div className={styles.lobbyContainer}>
                <button onClick={leaveLobby} className={styles.lobbyLeaveBtn}>
                    ← Выйти из лобби
                </button>

                <div className={styles.lobbyInfoCard}>
                    <h2 className={styles.lobbyTitle}>
                        Лобби: <span className={styles.lobbyCode}>{lobbyCode}</span>
                    </h2>
                    <p className={styles.lobbyQuizId}>Квиз ID: {lobby.quizId}</p>
                    <p className={styles.lobbyStatus}>Статус: <strong>{lobby.status}</strong></p>
                </div>

                <h3 className={styles.playersTitle}>Игроки ({lobby.players.length}):</h3>

                <table className={styles.playersTable}>
                    <thead>
                    <tr>
                        <th className={styles.tableHeader}>#</th>
                        <th className={styles.tableHeader}>Игрок</th>
                        <th className={styles.tableHeader}>Роль</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lobby.players.map((p: any, i: number) => (
                        <tr key={i} className={styles.tableRow}>
                            <td className={styles.tableCell}>{i + 1}</td>
                            <td className={styles.tableCell}>
                                {p.name}
                                {p.name === playerName && <span className={styles.playerBadgeMe}>Вы</span>}
                            </td>
                            <td className={styles.tableCell}>
                                {p.isHost ? (
                                    <span className={styles.playerBadge}>Организатор</span>
                                ) : (
                                    <span className={styles.playerRole}>Игрок</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {lobby.status === 'waiting' && isHost && (
                    <button
                        onClick={() => startGame(lobby.id)}
                        className={styles.lobbyStartBtn}
                    >
                        Начать игру для всех
                    </button>
                )}

                {lobby.status === 'waiting' && !isHost && (
                    <p className={styles.lobbyWaitingText}>Ожидайте, пока организатор начнет игру...</p>
                )}
            </div>
        );
    }

    return (

        <div className={styles.lobbyContainer}>
            <h1 className={styles.Title}>Мультиплеер Квиз</h1>

            <input
                placeholder="Ваше имя"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className={styles.input}
            />

            <h3 className={styles.Subtitle}>Создать лобби</h3>
            <div className={styles.inputGroup}>
                <input
                    placeholder="ID Квиза"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className={styles.input}
                />
                <button
                    onClick={() => createLobby(playerName, quizId)}
                    disabled={!isConnected}
                    className={styles.button}
                >
                    Создать
                </button>
            </div>

            <h3 className={styles.Subtitle}>Войти в лобби</h3>
            <div className={styles.inputGroup}>
                <input
                    placeholder="Код лобби"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className={styles.input}
                />
                <button
                    onClick={() => joinLobby(joinCode, playerName)}
                    disabled={!isConnected}
                    className={styles.button}
                >
                    Войти
                </button>
            </div>
        </div>
    );
};