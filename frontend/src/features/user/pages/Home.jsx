import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../../../store/UserData";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, setIsNewVideo, resetIsNewVideo, isCommentOpen, isExpand, setVideoId } = useAppState();
    const [videos, setVideos] = useState([]);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchVideos().then((data) => {
            console.log(data)
            setVideos(data);
            setVideoId(data[0].id || 0);
            setIsNewVideo(true);
            videoRefs.current = data.map(() => React.createRef());
        });
    }, []);

    // Cung cấp phương thức cuộn cho component cha
    useImperativeHandle(homeRef, () => ({
        scrollToVideo: (index) => {
            if (videoRefs.current[index]?.current) {
                videoRefs.current[index].current.scrollIntoView({ behavior: "smooth", block: "center" });
                setCurrentIndex(index);
                console.log(index)

                setVideoId(videos[index].id)
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
            setVideoId(videos[newIndex].id)
        }
    };

    return (
        <div className="d-flex main-home">
            {isExpand ? (
                <>
                    <div style={{ width: "70px" }}></div>
                </>
            ) : (
                <>
                    <div style={{ width: "70px" }}></div>
                </>
            )}
            <div className="home w-100" ref={containerRef} onScroll={handleScroll}>
                <div className="video-container">
                    {videos.map((video, index) => (
                        <div ref={videoRefs.current[index]} key={video.id} className="video-wrapper">
                            <VideoCard navigate={navigate} video={video} isNewVideo={isNewVideo} resetIsNewVideo={resetIsNewVideo} />
                        </div>
                    ))}
                </div>
            </div>
            {isCommentOpen ? (
                <>
                    <div style={{ width: "90px" }} className="space-home"></div>
                </>
            ) : (
                <>
                    <div style={{ width: "240px" }} className="space-home"></div>
                </>
            )}
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
