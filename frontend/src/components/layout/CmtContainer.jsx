import React from "react";
import CmtWrapperParent from "../ui/CmtWrapperParent";
import { useAppState } from "../../store/AppData";
import "../../styles/CmtContainer.css";

const CmtContainer = ({setIsLoginOpen}) => {
  const { isCommentOpen, setIsCommentOpen } = useAppState();
  if (!isCommentOpen) return null;

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
          />
          <CmtWrapperParent
            avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
            username="Doãn Chí Bình"
            content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
            time="5 ngày trước"
            likes={2800}
            replies={53}
          />
          <CmtWrapperParent
            avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-h7mrLMeN6YSKP4xRLCuU-G4idEdVKctWOA&s"  // Đổi thành link ảnh thực tế
            username="Doãn Chí Bình"
            content="Qua thấy clip mấy trinh sát này được chủ tịch nước thăng 2-3 cấp luôn 😘😘😘"
            time="5 ngày trước"
            likes={2800}
            replies={53}
          />
        </div>
        <div className="footer-cmt">
          <div className="bt-login-cmt" onClick={() => setIsLoginOpen(true)}>
            Đăng nhập để bình luận
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmtContainer;