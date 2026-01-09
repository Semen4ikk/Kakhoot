type TextErrorType = {
    textError: string;
}

export function ErrorMessage({textError}: TextErrorType) {

    return(
        <p style={{color: 'tomato'}}>
            {textError}
        </p>
    )
}