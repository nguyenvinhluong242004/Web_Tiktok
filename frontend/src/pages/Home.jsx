import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import VideoCard from "../components/VideoCard";
import { fetchVideos } from "../utils/api";
import "../styles/Home.css";

const Home = forwardRef(({ currentIndex, setCurrentIndex }, ref) => {
    const [videos, setVideos] = useState([]);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    useEffect(() => {
        fetchVideos().then((data) => {
            setVideos(data);
            videoRefs.current = data.map(() => React.createRef());
        });
    }, []);

    // Hàm cuộn đến video
    useImperativeHandle(ref, () => ({
        scrollToVideo: (index) => {
            if (videoRefs.current[index]) {
                videoRefs.current[index].current.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => setCurrentIndex(index), 300); // Cập nhật state sau khi cuộn
            }
        }
    }));

    // Xử lý lăn chuột -> Cập nhật currentIndex nếu lướt qua 50% video
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
        <div className="home" ref={containerRef} onScroll={handleScroll}>
            <div className="video-container">
                {videos.map((video, index) => (
                    <div ref={videoRefs.current[index]} key={video.id} className="video-wrapper">
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Home;
