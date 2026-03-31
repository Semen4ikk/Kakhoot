import { useSessionSocket } from "../../../entities/session/SessionContext.tsx";

import styles from './ResultWindow.module.css';
import {BackMainButton} from "../../../shared/ui/BackMainButton/BackMainButton.tsx";

export const ResultWindow = () => {
    const { gameState, playerName, leaveLobby } = useSessionSocket();

    const sortedLeaderboard = [...(gameState?.leaderboard || [])].sort(
        (a, b) => b.score - a.score
    );

    const winner = sortedLeaderboard[0];
    const currentPlayer = sortedLeaderboard.find((p) => p.name === playerName);
    const currentPlayerRank = currentPlayer
        ? sortedLeaderboard.findIndex((p) => p.name === playerName) + 1
        : 0;

    const getMedal = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };


    return (
        <div className={styles.finalPage}>
            <div className={styles.finalContainer}>
                <div className={styles.finalHeader}>
                    <h1 className={styles.finalTitle}>Игра завершена!</h1>
                    <p className={styles.finalSubtitle}>Итоговая таблица результатов</p>
                </div>

                {winner && (
                    <div className={styles.winnerSection}>
                        <div className={styles.winnerCrown}>👑</div>
                        <div className={styles.winnerText}>
                            <div className={styles.winnerLabel}>Победитель</div>
                            <div className={styles.winnerName}>{winner.name}</div>
                            <div className={styles.winnerPoints}>{winner.score} очков</div>
                        </div>
                    </div>
                )}

                <div className={styles.leaderboardTable}>
                    <div className={styles.tableHeader}>
                        <span className={styles.thRank}>Место</span>
                        <span className={styles.thPlayer}>Игрок</span>
                        <span className={styles.thScore}>Очки</span>
                    </div>

                    <div className={styles.tableBody}>
                        {sortedLeaderboard.map((player, index) => {
                            const isCurrentPlayer = player.name === playerName;
                            const isWinner = index === 0;

                            return (
                                <div
                                    key={player.name}
                                    className={`${styles.tableRow} ${isCurrentPlayer ? styles.isCurrent : ''} ${isWinner ? styles.isWinner : ''}`}
                                >
                                    <div className={styles.tdRank}>{getMedal(index)}</div>
                                    <div className={styles.tdPlayer}>
                                        <span className={styles.playerName}>
                                            {player.name}
                                            {isCurrentPlayer && <span className={styles.youBadge}> (Вы)</span>}
                                        </span>
                                    </div>
                                    <div className={styles.tdScore}>{player.score}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {currentPlayer && (
                    <div className={styles.yourResult}>
                        <p>Ваш результат: <strong>{currentPlayerRank} место из {sortedLeaderboard.length}</strong></p>
                        <p>Набрано очков: <strong>{currentPlayer.score}</strong></p>
                    </div>
                )}

                <BackMainButton Leave={leaveLobby}/>
            </div>
        </div>
    );
};