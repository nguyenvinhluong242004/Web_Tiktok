import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./styles/App.css";

function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const homeRef = useRef(null);

    const handleScrollButton = (direction) => {
        const newIndex = currentIndex + direction;
        if (newIndex < 0) return;

        if (homeRef.current) {
            homeRef.current.scrollToVideo(newIndex);
        }
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home ref={homeRef} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />} />
                    </Routes>
                </div>
                <Footer onScroll={handleScrollButton} />
            </div>
        </Router>
    );
}

export default App;
