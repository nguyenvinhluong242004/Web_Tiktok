import React, { useRef, useState } from "react";
import CmtWrapperParent from "../ui/CmtWrapperParent";
import { useAppState } from "../../../../store/UserData";
import GetUserStrorage from "../../../../hooks/UseStorage";
import InputComment from "../ui/InputComment"
import "../../styles/CmtContainer.css";

const CmtContainer = () => {
  const { isCommentOpen, setIsCommentOpen, setIsLoginOpen, activeCommentId, setActiveCommentId } = useAppState();
  const [inputMain] = useState(false);
  if (!isCommentOpen) return null;
  const user = GetUserStrorage();

  return (
    <div className="cmt-container">
      <div className="main-cmt">
        <div className="header-cmt d-flex justify-content-between">
          <h5 className="mb-4">Bình luận</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setIsCommentOpen(false)}
          ></button>
        </div>
        <div className="list-cmt">
          <CmtWrapperParent
            avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
            username="Doãn Chí Bình"
            content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
            time="5 ngày trước"
            likes={2800}
            replies={53}
            id={1}
            isOpenInput={activeCommentId === 1}
            onReplyClick={() => setActiveCommentId(1)}
          />
          <CmtWrapperParent
            avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
            username="Doãn Chí Bình"
            content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
            time="5 ngày trước"
            likes={2800}
            replies={53}
            id={7}
            isOpenInput={activeCommentId === 7}
            onReplyClick={() => setActiveCommentId(7)}
          />
          <CmtWrapperParent
            avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
            username="Doãn Chí Bình"
            content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
            time="5 ngày trước"
            likes={2800}
            replies={53}
            id={12}
            isOpenInput={activeCommentId === 12}
            onReplyClick={() => setActiveCommentId(12)}
          />
        </div>
      </div>
      <div className="footer-cmt">
        {user ? (
          <div className="ft-input-cmt">
            <InputComment isClose={inputMain} />
          </div>
        ) : (
          <div className="bt-login-cmt mb-2" onClick={() => setIsLoginOpen(true)}>
            Đăng nhập để bình luận 
          </div>
        )}
      </div>
    </div>
  );
};

export default CmtContainer;