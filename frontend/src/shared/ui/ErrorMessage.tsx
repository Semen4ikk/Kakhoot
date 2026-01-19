import styles from './ErrorMessage.module.css';

type TextErrorType = {
    textError: string;
};

export function ErrorMessage({ textError }: TextErrorType) {
    return (
        <span className={styles.errorMessage}>
            {textError}
        </span>
    );
}