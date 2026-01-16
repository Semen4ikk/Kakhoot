import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RegistrationPage} from "../pages/RegistrationPage.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {MainPage} from "../pages/MainPage.tsx";
import {QuizPage} from "../pages/QuizPage.tsx";


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App