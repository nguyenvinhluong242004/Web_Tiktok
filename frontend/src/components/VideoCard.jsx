import React from 'react';
import "../styles/VideoCard.css";

const VideoCard = ({ video }) => {
    return (
        <div className="video-card">
            <video src={video.url} controls />

            <div className="bt-action">
                <div className="actions d-flex flex-column align-items-center">
                    <img className="avt-profile" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlrDBSmMQyqmbeYR0Xbhkf0f8YmLQGju_8nw&s" alt="" />
                    <div className="btn-act">
                        <div className="btn-action" id="heart">
                            <i class="bi bi-heart-fill"></i>
                        </div>
                        <span>17.4k</span>
                    </div>
                    <div className="btn-act">
                        <div className="btn-action" id="chat">
                            <i class="bi bi-chat-dots-fill"></i>
                        </div>
                        <span>2004</span>
                    </div>
                    <div className="btn-act">
                        <div className="btn-action" id="bookmark">
                            <i class="bi bi-bookmark-fill"></i>
                        </div>
                        <span>74</span>
                    </div>
                    <div className="btn-act">
                        <div className="btn-action" id="share">
                            <i className="bi bi-reply-fill" style={{ transform: "scaleX(-1)" }}></i>
                        </div>
                        <span>244</span>
                    </div>
                    <img className="n-music" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlrDBSmMQyqmbeYR0Xbhkf0f8YmLQGju_8nw&s" alt="" />
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
