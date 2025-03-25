import { createContext, useContext, useState, useRef, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isNewVideo, setIsNewVideo] = useState(false);
    const homeRef = useRef(null);

    useEffect(() => {
        setIsNewVideo(true);
    }, [currentIndex]);

    const handleScrollButton = (direction) => {
        const newIndex = currentIndex + direction;
        if (newIndex < 0) return;

        if (homeRef.current) {
            homeRef.current.scrollToVideo(newIndex);
        }
    };

    const resetIsNewVideo = () => {
        setIsNewVideo(false);
    };
    return (
        <AppContext.Provider value={{ currentIndex, setCurrentIndex, homeRef, handleScrollButton, isNewVideo, resetIsNewVideo }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => useContext(AppContext);
