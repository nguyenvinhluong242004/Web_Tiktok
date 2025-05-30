import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../../../store/UserData";
import { useNavigate } from "react-router-dom";
import { addFollow, deleteFollow } from "../services/apiActionUser";
import GetUserStrorage from "../../../hooks/UseStorage";
import "../styles/Home.css";

const Home = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, setIsNewVideo, resetIsNewVideo, isCommentOpen, isExpand, setVideoId } = useAppState();
    const [videos, setVideos] = useState([]);
    const containerRef = useRef(null);
    const videoRefs = useRef([]);
    const navigate = useNavigate();
    const [user, setUser] = useState({});


    useEffect(() => {
        const user = GetUserStrorage(); // Kiểm tra profile
        setUser(user);
        console.log(user);

        let uuid = 0;
        if (user){
            uuid = user.uuid;
        }

        fetchVideos(uuid).then((data) => {
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

    const handleFollower = (uuid) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Vui lòng đăng nhập để thực hiện hành động này.");
            return;
        }

        const followerId = user.uuid;
        const followingId = uuid;

        if (videos[currentIndex].isFollowed) {
            deleteFollow(followerId, followingId)
                .then(() => {
                    console.log("Unfollowed successfully");
                    setVideos((prevVideos) =>
                        prevVideos.map((video, index) =>
                            index === currentIndex ? { ...video, isFollowed: false } : video
                        )
                    );
                    console.log(videos)
                })
                .catch((error) => console.error(error));
        } else {
            addFollow(followerId, followingId)
                .then(() => {
                    console.log("Followed successfully");
                    setVideos((prevVideos) =>
                        prevVideos.map((video, index) =>
                            index === currentIndex ? { ...video, isFollowed: true } : video
                        )
                    );
                    console.log(videos)
                })
                .catch((error) => console.error(error));
        }


    }

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
                            <VideoCard
                                navigate={navigate}
                                video={video}
                                isNewVideo={isNewVideo}
                                resetIsNewVideo={resetIsNewVideo}
                                handleFollower={handleFollower}
                                uid={user?.userid || -1}
                            />
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
