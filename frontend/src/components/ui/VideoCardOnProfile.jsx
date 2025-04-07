import React, { useRef, useState, useEffect } from "react";
import VideoOptions from "../ui/VideoOptions"; // Import menu tùy chọn
import { FaPlay, FaPause } from "react-icons/fa";
import { useAppState } from "../../features/user/store/AppData";
import "../../styles/User/VideoCardOnProfile.css";

const VideoCardOnProfile = ({ video, isNewVideo, resetIsNewVideo }) => {
    const { isCommentOpen, setIsCommentOpen } = useAppState();
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    //const [isHide, setHide] = useState(false);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false); // 🆕 Trạng thái menu
    const [showButton, setShowButton] = useState(false);
    const [showSpeaker, setShowSpeaker] = useState(false);
    const [isClickButton, setIsClickButton] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !isNewVideo) return;

        // if (!isHide) {
        //     console.log("hhh")
        //     return;
        // }

        console.log("🔄 Reset video...");

        setPlaying(false);
        setMuted(true);
        setProgress(0);
        setCurrentTime(0);
        setDuration(videoElement.duration || 0);
        videoElement.currentTime = 0;
        resetIsNewVideo();
        setPlaying(true);
        videoElement.play().catch(error => {
            console.error("Không thể phát video:", error);
        });
    }, [isNewVideo, resetIsNewVideo]);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.background = `linear-gradient(to right, #ff3b5c ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%)`;
        }
    }, [progress]);

    const togglePlay = () => {
        if (playing) videoRef.current.pause();
        else videoRef.current.play();
        setPlaying(!playing);

        setShowAnimation(true);

        setTimeout(() => setShowAnimation(false), 500); // Ẩn icon sau 0.5s
    };

    const toggleMute = () => {
        setMuted(!muted);
        videoRef.current.muted = !videoRef.current.muted;
    };

    const handleTimeUpdate = () => {
        const videoElement = videoRef.current;
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
        setCurrentTime(videoElement.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleSeek = (e) => {
        const videoElement = videoRef.current;
        const newTime = (e.target.value / 100) * videoElement.duration;
        videoElement.currentTime = newTime;
        setProgress(e.target.value);

        // Hiển thị timer khi kéo
        const timerElement = videoRef.current.parentNode.querySelector(".video-timer")
        timerElement.style.opacity = "1";
    };
    const disableTimer = () => {
        const timerElement = videoRef.current.parentNode.querySelector(".video-timer")
        timerElement.style.opacity = "0";
    };

    return (
        <div className="d-flex position-relative">
            <div className="video-card"

                onMouseEnter={() => {
                    if (isClickButton) {
                        setMenuOpen(false);
                        console.log("cllll");
                    }
                    setShowButton(true);
                    setShowSpeaker(true);
                }}
                onMouseLeave={() => {
                    setShowButton(false);
                    //setMenuOpen(false);
                    setShowSpeaker(false);
                }}

            >
                <div className="video-ct"
                >
                    <video
                        src={video.videoUrl}
                        ref={videoRef}
                        autoPlay
                        loop
                        muted={muted}
                        playsInline
                        preload="auto"
                        controls={false}
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onContextMenu={(e) => e.preventDefault()}
                        controlsList="nodownload nofullscreen noremoteplayback"

                    />
                    {showAnimation && (
                        <div className="play-pause-icon">
                            {playing ? <FaPause size={40} /> : <FaPlay size={40} />}
                        </div>
                    )}
                    <div className="video-timer">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <input
                        type="range"
                        className="video-progress"
                        ref={progressRef}
                        value={progress}
                        max="100"
                        onChange={handleSeek}
                        onMouseLeave={disableTimer}
                    />
                    {showSpeaker && (
                        <div className="video-controls">
                            <i
                                className={`bi ${muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"} volume-icon`}
                                onClick={toggleMute}
                            ></i>
                        </div>
                    )}
                    {/* Nút menu (góc trên bên phải) */}
                    {showButton && (
                        <div
                            className="position-absolute top-0 end-0"
                            onMouseEnter={() => {
                                setMenuOpen(true);
                                if (isClickButton) {
                                    setIsClickButton(false);
                                    setMenuOpen(false);
                                }
                            }}
                            onMouseLeave={() => setMenuOpen(isClickButton)}
                        >
                            <button
                                className="btn text-white p-2"
                                type="button"
                                onClick={() => setIsClickButton(!isClickButton) && setMenuOpen(menuOpen)}
                            >
                                <i className="bi bi-three-dots fs-4"></i>
                            </button>
                        </div>
                    )}
                </div>

                <div className="bt-action">
                    <div className="actions d-flex flex-column align-items-center">
                        <div className="header-btn">
                            <img className="avt-profile" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlrDBSmMQyqmbeYR0Xbhkf0f8YmLQGju_8nw&s" alt="profile" />
                            <div className="add-follow"><span>+</span></div>
                        </div>
                        <div className="btn-act">
                            <div className="btn-action" id="heart">
                                <i className="bi bi-heart-fill"></i>
                            </div>
                            <span>17.4k</span>
                        </div>
                        <div className="btn-act">
                            <div className="btn-action" id="chat" onClick={() => setIsCommentOpen(!isCommentOpen)}>
                                <i className="bi bi-chat-dots-fill"></i>
                            </div>
                            <span>2004</span>
                        </div>
                        <div className="btn-act">
                            <div className="btn-action" id="bookmark">
                                <i className="bi bi-bookmark-fill"></i>
                            </div>
                            <span>74</span>
                        </div>
                        <div className="btn-act">
                            <div className="btn-action" id="share">
                                <i className="bi bi-reply-fill" style={{ transform: "scaleX(-1)" }}></i>
                            </div>
                            <span>244</span>
                        </div>
                        <img className="n-music" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlrDBSmMQyqmbeYR0Xbhkf0f8YmLQGju_8nw&s" alt="music" />
                    </div>
                </div>
            </div>

            {/* Truyền trạng thái menu xuống VideoOptions */}
            <VideoOptions isOpen={menuOpen} setMenuOpen={setMenuOpen} setIsClickButton={setIsClickButton} setShowButton={setShowButton} />
        </div>
    );
};

export default VideoCardOnProfile;
