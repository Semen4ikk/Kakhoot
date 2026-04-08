import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RegistrationPage} from "../pages/RegisterPage/RegistrationPage.tsx";
import {LoginPage} from "../pages/LoginPage/LoginPage.tsx";
import {MainPage} from "../pages/MainPage/MainPage.tsx";
import {QuizPage} from "../pages/QuizPage/QuizPage.tsx";
import {LobbyPage} from "../pages/LobbyPage/LobbyPage.tsx";
import {SessionProvider} from "../entities/session/SessionContext.tsx";
import {CreateQuizPage} from "../pages/CreateQuizPage/CreateQuizPage.tsx";

export function Routing() {
    return (
        <SessionProvider>
            <Router>
                <Routes>
                    <Route path="/registration" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/main" element={<MainPage />} />
                    <Route path="/createQuiz" element={<CreateQuizPage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/lobby" element={<LobbyPage />} />
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </Router>
        </SessionProvider>

    )
}