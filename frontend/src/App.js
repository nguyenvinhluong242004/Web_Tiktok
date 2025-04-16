import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // 🛠 Thêm import Routes, Route
import { UserProvider } from "./store/UserData";
import Navbar from "./features/user/components/layout/Navbar";
import CmtContainer from "./features/user/components/layout/CmtContainer";
import LoginModal from "./features/user/components/ui/LoginModal";
import Profile from "./features/user/pages/Profile";
import PrivateRoutes from "./routes/PrivateRoute";
import Home from "./features/user/pages/Home";
import DetailVideoOnProfile from "./features/user/pages/DetailVideoOnProfile";
import "./styles/App.css";

function App() {
    const [reload, setReload] = useState(0);

    return (
        <UserProvider>
            <Router>
                <div className="app-container">
                    <Navbar reload={reload} setReload={setReload} />
                    <LoginModal />
                    <div className="content">
                        <Routes key={reload}>
                            {/* Public Routes */}
                            <Route path=":uid/video/*" element={<DetailVideoOnProfile />} />
                            <Route path=":uid/" element={<Profile />} />
                            <Route path="/" element={<Home />} />
                            {/* Private Routes */}
                            <Route path="/p/*" element={<PrivateRoutes />} />
                        </Routes>
                    </div>
                    <CmtContainer key={reload} />
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
