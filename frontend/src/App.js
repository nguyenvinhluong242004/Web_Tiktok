import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./store/AppData";
import PublicRoutes from "./routes/PublicRoute";
import PrivateRoutes from "./routes/PrivateRoute";
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
                        <div><PublicRoutes /></div>
                        <div><PrivateRoutes /></div>
                    </div>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
