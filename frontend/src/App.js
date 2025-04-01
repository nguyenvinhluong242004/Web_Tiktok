import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 🛠 Thêm import Routes, Route
import { AppProvider } from "./store/AppData";
import Navbar from "./components/layout/Navbar";
import CmtContainer from "./components/layout/CmtContainer";
import LoginModal from "./components/ui/LoginModal";
import PrivateRoutes from "./routes/PrivateRoute";
import Home from "./pages/Home";
import UploadImage from "./components/ui/test";
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
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/upload" element={<UploadImage />} />
                            {/* Private Routes */}
                            <Route path="/*" element={<PrivateRoutes />} />
                        </Routes>
                    </div>
                    <CmtContainer setIsLoginOpen={setIsLoginOpen} />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
