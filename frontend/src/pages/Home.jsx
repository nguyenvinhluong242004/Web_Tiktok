import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos, checkAccessToken } from "../components/utils/api";
import { useAppState } from "../store/AppData"; 
import "../styles/Home.css";

const Home = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, resetIsNewVideo } = useAppState();
    const [videos, setVideos] = useState([]);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    useEffect(() => {
        fetchVideos().then((data) => {
            setVideos(data);
            videoRefs.current = data.map(() => React.createRef());
        });
        checkAccessToken();
    }, []);

    // Cung cấp phương thức cuộn cho component cha
    useImperativeHandle(homeRef, () => ({
        scrollToVideo: (index) => {
            if (videoRefs.current[index]?.current) {
                videoRefs.current[index].current.scrollIntoView({ behavior: "smooth", block: "center" });
                setCurrentIndex(index);
            }
        }
    }));

    // Xác định video nào đang ở giữa màn hình khi cuộn
    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const containerHeight = container.clientHeight;

        const newIndex = videoRefs.current.findIndex((ref) => {
            if (!ref.current) return false;
            const { offsetTop, offsetHeight } = ref.current;
            return (
                offsetTop < scrollPosition + containerHeight * 0.5 &&
                offsetTop + offsetHeight > scrollPosition + containerHeight * 0.5
            );
        });

        if (newIndex !== -1 && newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <div className="d-flex main-home">
            <div style={{width: "70px"}}></div>
            <div className="home w-100" ref={containerRef} onScroll={handleScroll}>
                <div className="video-container">
                    {videos.map((video, index) => (
                        <div ref={videoRefs.current[index]} key={video.id} className="video-wrapper">
                            <VideoCard video={video} isNewVideo={isNewVideo} resetIsNewVideo={resetIsNewVideo}/>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{width: "250px"}}></div>
            <div className="footer">
                <div className="bt-prev" onClick={() => handleScrollButton(-1)}>
                    <i className="bi bi-chevron-up"></i>
                </div>
                <div className="bt-next" onClick={() => handleScrollButton(1)}>
                    <i className="bi bi-chevron-down"></i>
                </div>
            </div>
        </div>
    );
};

export default Home;
