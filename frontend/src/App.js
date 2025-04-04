import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 🛠 Thêm import Routes, Route
import { AppProvider } from "./store/AppData";
import Navbar from "./components/layout/Navbar";
import CmtContainer from "./components/layout/CmtContainer";
import LoginModal from "./components/ui/LoginModal";
import PrivateRoutes from "./routes/PrivateRoute";
import Home from "./pages/Home";
import "./styles/User/App.css";

function App() {
    const [reload, setReload] = useState(0);

    return (
        <AppProvider>
            <Router>
                <div className="app-container">
                    <Navbar reload={reload} setReload={setReload} />
                    <LoginModal />
                    <div className="content">
                        <Routes key={reload}>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            {/* Private Routes */}
                            <Route path="/*" element={<PrivateRoutes />} />
                        </Routes>
                    </div>
                    <CmtContainer key={reload} />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;
