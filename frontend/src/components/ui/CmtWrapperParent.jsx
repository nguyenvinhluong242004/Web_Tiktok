import React from "react";
import CmtWrapperChild from "./CmtWrapperChild";
import "../../styles/User/CmtWrapperParent.css";

const CmtWrapper = ({ avatar, username, content, time, likes, replies }) => {
    return (
        <div className="cmt-wrapper">
            <img src={avatar} alt="avatar" className="avatar" />
            <div className="cmt-content">
                <div className="username">{username}</div>
                <span className="ct-cmt">{content}</span>
                <div className="cmt-info">
                    <span className="time">{time}</span>
                    <span className="likes"><i className="bi bi-suit-heart"></i> {likes}</span>
                    <span style={{ cursor: "pointer" }} className="reply">Trả lời</span>
                </div>
                <CmtWrapperChild
                    avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
                    username="Doãn Chí Bình"
                    content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
                    time="5 ngày trước"
                    likes={2800}
                    replies={53}
                />
                <CmtWrapperChild
                    avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
                    username="Doãn Chí Bình"
                    content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
                    time="5 ngày trước"
                    likes={2800}
                    replies={53}
                />
                {replies > 0 && (
                    <div className="view-replies"><hr /> Xem {replies} câu trả lời <i className="bi bi-chevron-down"></i></div>
                )}
            </div>
        </div>
    );
};

export default CmtWrapper;
