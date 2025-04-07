import React from "react";
import "../../styles/CmtWrapperChild.css";

const CmtWrapper = ({ avatar, username, content, time, likes, replies }) => {
    return (
        <div className="cmt-wrapper-child">
            <img src={avatar} alt="avatar" className="avatar-child" />
            <div className="cmt-content-child">
                <div className="username-child">{username}</div>
                <span className="ct-cmt-child">{content}</span>
                <div className="cmt-info-child">
                    <span className="time">{time}</span>
                    <span className="likes-child"><i className="bi bi-suit-heart"></i> {likes}</span>
                    <span style={{ cursor: "pointer" }} className="reply">Trả lời</span>
                </div>
            </div>
        </div>
    );
};

export default CmtWrapper;
