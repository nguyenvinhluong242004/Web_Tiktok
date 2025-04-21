import React, { useRef, useState, useEffect } from "react";
import VideoOptions from "../ui/VideoOptions"; // Import menu tùy chọn
import { FaPlay, FaPause } from "react-icons/fa";
import { useAppState } from "../../../../store/UserData";
import "../../styles/VideoProfile.css";

const VideoProfile = ({ navigate, video, isNewVideo, resetIsNewVideo }) => {
    const [volume, setVolume] = useState(0.5); // giá trị mặc định là 50%
    const { isCommentOpen, setIsCommentOpen, videoId, setVideoId, muted, setMuted } = useAppState();
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    //const [isHide, setHide] = useState(false);
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
        if (videoId !== video.id) {
            console.log("muted")
            setPlaying(false);
            videoElement.pause();
            return;
        }

        console.log("🔄 Reset video...");
        //console.log(video)

        setPlaying(false);
        //setMuted(true);
        setProgress(0);
        setCurrentTime(0);
        setDuration(videoElement.duration || 0);
        videoElement.currentTime = 0;
        resetIsNewVideo();

        const savedVolume = parseFloat(sessionStorage.getItem("volume"));
        const validVolume = !isNaN(savedVolume) ? savedVolume : 0.1;
        videoElement.volume = validVolume;
        setVolume(validVolume);

        // const savedMuted = sessionStorage.getItem("muted") === "true";
        // console.log(savedMuted)
        // videoElement.muted = savedMuted;
        // setMuted(savedMuted);

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

    useEffect(() => {
        if (videoRef.current) {
            sessionStorage.setItem("volume", JSON.stringify(volume));
            videoRef.current.volume = volume;
        }
    }, [volume]);


    const togglePlay = () => {
        if (playing) videoRef.current.pause();
        else videoRef.current.play();
        setPlaying(!playing);

        setShowAnimation(true);

        setTimeout(() => setShowAnimation(false), 500); // Ẩn icon sau 0.5s
    };

    const toggleMute = () => {
        const newMuted = !muted;
        setMuted(newMuted);
        //sessionStorage.setItem("muted", newMuted.toString());
        if (videoRef.current) {
            videoRef.current.muted = newMuted;
        }
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
    };

    const handleRedirectProfileUser = (userid) => {
        navigate(`@${userid}`);
    }

    return (
        <div className="d-flex position-relative justify-content-between">
            <div style={{width: "200px"}}></div>
            <div className="video-card-profile"

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
                <div className="video-ct-profile"
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
                        <div className="play-pause-icon-profile">
                            {playing ? <FaPause size={40} /> : <FaPlay size={40} />}
                        </div>
                    )}
                    <div className="video-timer-profile">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <input
                        type="range"
                        className="video-progress-profile"
                        ref={progressRef}
                        value={progress}
                        max="100"
                        onChange={handleSeek}
                    />
                    {showSpeaker && (
                        <div className="video-controls-profile d-flex align-items-center">
                            <i
                                className={`bi ${muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"} volume-icon`}
                                onClick={toggleMute}
                            ></i>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                                style={{
                                    width: "60px",
                                    marginLeft: "5px",
                                    background: `linear-gradient(to right, #ff3b5c ${volume * 100}%, rgba(255, 255, 255, 0.3) ${volume * 100}%)`
                                }}
                            />

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

            </div>
            <div style={{width: "150px"}}></div>
            {/* Truyền trạng thái menu xuống VideoOptions */}
            <VideoOptions isOpen={menuOpen} setMenuOpen={setMenuOpen} setIsClickButton={setIsClickButton} setShowButton={setShowButton} />
        </div>
    );
};

export default VideoProfile;
