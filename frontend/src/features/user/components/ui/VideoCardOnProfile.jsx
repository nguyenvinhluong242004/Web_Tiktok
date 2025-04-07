import React, { useState, useRef } from "react";
import "../../styles/VideoCardOnProfile.css";

const VideoCardOnProfile = ({ video }) => {
    const videoRef = useRef(null); // Để tham chiếu tới thẻ video
    const [isPlay, setIsPlay] = useState(false);

    // Hàm phát video khi đưa chuột vào
    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlay(true);
        }
    };

    // Hàm dừng video khi chuột rời đi
    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset video về đầu
            setIsPlay(false);
        }
    };

    if (!video || !video.videoUrl) return null;

    return (
        <div className="video-card-on-profile">
            <div
                className="video-card-on-profile__thumbnail"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    poster={video.thumbnail}
                    muted
                    autoPlay={false} // Không tự động phát
                />
            </div>
            <div className="video-card-on-profile__info">
                <div className="info">
                    <i className="bi bi-play"></i>
                    <div>{video.totalViews}</div>
                </div>
                <div className="bi bi-lock"></div>
            </div>
        </div>
    );
};

export default VideoCardOnProfile;
