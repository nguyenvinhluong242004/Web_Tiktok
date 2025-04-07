import { createContext, useContext, useState, useRef, useEffect } from "react";

const AppContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isNewVideo, setIsNewVideo] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    const [isSearch, setIsSearch] = useState(true);
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
        <AppContext.Provider value={{
            currentIndex, setCurrentIndex,
            homeRef, handleScrollButton,
            isNewVideo, resetIsNewVideo,
            isCommentOpen, setIsCommentOpen,
            isExpand, setIsExpand,
            isSearch, setIsSearch,
            isLoginOpen, setIsLoginOpen
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => useContext(AppContext);
