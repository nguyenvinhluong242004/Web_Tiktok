import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppData";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import LoginModal from "./components/ui/LoginModal";
import "./styles/App.css";

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <AppProvider>
            <Router>
                <div className="app-container">
                    <Navbar onLoginClick={() => setIsLoginOpen(true)} />
                    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
