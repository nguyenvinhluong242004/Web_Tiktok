import React, { useRef, useState } from "react";
import CmtWrapperParent from "../ui/CmtWrapperParent";
import { useAppState } from "../../../../store/UserData";
import GetUserStrorage from "../../../../hooks/UseStorage";
import InputComment from "../ui/InputComment"
import "../../styles/ContentVideoProfile.css";

const ContentVideoProfile = ({ user, video }) => {
  const { isCommentOpen, setIsCommentOpen, setIsLoginOpen, activeCommentId, setActiveCommentId } = useAppState();
  const [inputMain] = useState(false);

  const parseText = (input) => {
    return input.split(/\n/).flatMap((line, i) => [
      ...line.split(/(\s+)/).map((part, index) => {
        if (part.startsWith('#')) {
          const tag = part.substring(1);
          return <a style={{ color: "rgb(32, 147, 255)", fontWeight: "600" }} key={`${i}-${index}`} href={`/hashtag/${tag}`} className='hashtag'>{part}</a>;
        }
        if (part.startsWith('@')) {
          const user = part.substring(1);
          return <a key={`${i}-${index}`} href={`/user/${user}`} className='link-user'>{part}</a>;
        }
        return part;
      }),
      <br key={`br-${i}`} />
    ]);
  };

  return (
    <div className="video-cmt-container">
      <div className="video-main-cmt">
        {user ? (
          <div className="video-header-cmt justify-content-between">
            <div className="v-ct-info">
              <div className="name-avt-fl">
                <div>
                  <img style={{ width: "45px", borderRadius: "50%", marginRight: "20px" }} src={user ? user.profileImage : ''} alt="" />

                </div>
                <div className="uid-name">
                  <div className="v-uid">{user.userid}</div>
                  <div className="v-u-name">{user.username}</div>
                </div>
                <div className="btn-prf-change justify-content-center" style={{ width: "120px", height: "36px", borderRadius: "3px", margin: "0" }}
                  onClick={console.log("click")}
                >Follow</div>
              </div>
              {video.description ?
                <div className="v-content">
                  {parseText(video.description)}
                </div>
                : <></>}
              <div className="v-music">
                <i className="bi bi-music-note-beamed"></i>
                <div>Suýt nữa thì</div>
              </div>
            </div>
          </div>
        ) :
          (
            <></>
          )}
        <div className="video-list-cmt">
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
      <div className="video-footer-cmt">
        {user ? (
          <div className="video-ft-input-cmt">
            <InputComment isClose={inputMain} />
          </div>
        ) : (
          <div className="video-bt-login-cmt" onClick={() => setIsLoginOpen(true)}>
            Đăng nhập để bình luận
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentVideoProfile;