import React, { useState, useRef } from "react";
import "../../styles/VideoCardOnProfile.css";
import { useNavigate } from "react-router-dom";
const VideoCardOnProfile = ({ video, id }) => {
    const videoRef = useRef(null); // Để tham chiếu tới thẻ video
    const [isPlay, setIsPlay] = useState(false);
    const navigate = useNavigate();

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

    const moveDetailVideo = (uid, videoid) => {
        navigate(`/@${uid}/video/${videoid}`);
    }

    if (!video || !video.videoUrl) return null;

    return (
        <div className="video-card-on-profile">
            <div
                className="video-card-on-profile__thumbnail"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => moveDetailVideo(video.uid, video.id)}
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
                {video.visibility === 'private' && <div className="bi bi-lock"></div>}
                {video.visibility === 'friends' && <div className="bi bi-people" style={{fontSize: "22px"}}></div>}
            </div>
            {video.id === id && (
                <div className="video-card-flag">
                    <div className="equalizer">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="text">Hiện đang phát</div>
                </div>
            )}

        </div>
    );
};

export default VideoCardOnProfile;
