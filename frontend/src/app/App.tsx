import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {RegistrationPage} from "../pages/RegistrationPage.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {MainPage} from "../pages/MainPage.tsx";


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App