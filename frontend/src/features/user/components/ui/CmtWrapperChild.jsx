import React from "react";
import InputComment from "./InputComment"
import "../../styles/CmtWrapperChild.css";

const CmtWrapper = ({ avatar, username, content, time, likes, replies, id, isOpenInput, onReplyClick }) => {
    return (
        <>
            <div className="cmt-wrapper-child">
                <img src={avatar} alt="avatar" className="avatar-child" />
                <div className="cmt-content-child">
                    <div className="username-child">{username}</div>
                    <span className="ct-cmt-child">{content}</span>
                    <div className="cmt-info-child">
                        <span className="time">{time}</span>
                        <span className="likes-child"><i className="bi bi-suit-heart"></i> {likes}</span>
                        <span style={{ cursor: "pointer" }} className="reply" onClick={onReplyClick}>Trả lời</span>
                    </div>
                </div>
                <div className="ct-like">
                    <i className="bi bi-heart"></i>
                    <div>7</div>
                </div>
            </div>
            <div className="reply-cmt-child">
                {isOpenInput ? (
                    <InputComment isClose={isOpenInput} />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default CmtWrapper;
