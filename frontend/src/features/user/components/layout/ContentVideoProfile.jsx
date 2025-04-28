import React, { useRef, useState } from "react";
import CmtWrapperParent from "../ui/CmtWrapperParent";
import { useAppState } from "../../../../store/UserData";
import GetUserStrorage from "../../../../hooks/UseStorage";
import InputComment from "../ui/InputComment"
import VideoDescription from "../utils/VideoDescription"
import VideoCardOnProfile from "../ui/VideoCardOnProfile"
import { useNavigate } from "react-router-dom";
import PrivacyVideoSettings from "../ui/PrivacyVideoSettings"
import "../../styles/ContentVideoProfile.css";

const ContentVideoProfile = ({ user, videos, video, pov }) => {
  const { isCommentOpen, setIsCommentOpen, setIsLoginOpen, activeCommentId, setActiveCommentId } = useAppState();
  const [inputMain] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState(0);
  const [isOpenSettingPrivacy, setIsOpenSettingPrivacy] = useState(false);
  const path = window.location.href;
  const id = video.id;
  const navigate = useNavigate(); // Thay thế window.location.href

  const switchTab = (id) => {
    setTab(id);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(path)
      .then(() => {
        alert("Đã sao chép liên kết!");
      })
      .catch((err) => {
        console.error("Lỗi sao chép:", err);
      });
  };

  const handleToggleMenu = (sta) => {
    setShowMenu(sta);
  };

  const handlePrivacySettings = () => {
    console.log("Cài đặt quyền riêng tư");
    setIsOpenSettingPrivacy(true);
  };

  const handleDelete = () => {
    console.log("Xóa video");
  };

  const getUser = () => {
    navigate(`/@${user.userid}`);
  }

  return (
    <div className="video-cmt-container">
      <div className="video-main-cmt">
        {user ? (
          <div className="video-header-cmt justify-content-between">
            <div className="v-ct-info">
              <div className="name-avt-fl">
                <div>
                  <img onClick={() => getUser()} style={{ width: "45px", borderRadius: "50%", marginRight: "20px", cursor: "pointer" }} src={user ? user.profileImage : ''} alt="" />
                </div>
                <div className="uid-name">
                  <div className="v-uid">{user.userid}</div>
                  <div className="v-u-name">{user.username}</div>
                </div>
                {pov === 'owner' ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div>
                      <i
                        style={{ cursor: 'pointer' }}
                        className="bi bi-three-dots"
                        onMouseEnter={() => handleToggleMenu(true)}
                        onMouseLeave={() => handleToggleMenu(false)}
                      ></i>
                    </div>
                    {showMenu && (
                      <div className="v-menu-opt-info"
                        onMouseEnter={() => handleToggleMenu(true)}
                        onMouseLeave={() => handleToggleMenu(false)}
                      >
                        <div onClick={handlePrivacySettings} className="v-menu-it">
                          Cài đặt quyền riêng tư
                        </div>
                        <div onClick={handleDelete} className="v-menu-it-erase"> Xóa </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="btn-prf-change justify-content-center"
                    style={{ width: '120px', height: '36px', borderRadius: '3px', margin: '0', }}
                    onClick={() => console.log('click')}
                  >
                    Follow
                  </div>
                )}

              </div>
              {video.description &&
                <div className="v-content">
                  <VideoDescription video={video} videoId={video.id} />
                </div>
              }
              <div className="v-music">
                <i className="bi bi-music-note-beamed"></i>
                <div>Suýt nữa thì</div>
              </div>
            </div>
            <div className="v-count-emoj">
              <div className="v-count">
                <div className="v-c-bgr">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <div className="v-total">0</div>
                <div className="v-c-bgr">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div className="v-total">0</div>
                <div className="v-c-bgr">
                  <i className="bi bi-bookmark-fill"></i>
                </div>
                <div className="v-total">0</div>
              </div>
              <div className="v-emoj">
                <div className="v-c-bgr">
                  <div>&lt;/&gt;</div>
                </div>
                <i class="bi bi-whatsapp"></i>
                <i class="bi bi-telegram"></i>
                <i class="bi bi-facebook"></i>
                <i className="bi bi-reply-fill" style={{ transform: "scaleX(-1)" }}></i>
              </div>
            </div>
            <div className="v-coppy">
              <div className="v-url">
                {path}
              </div>
              <div className="v-bt-coppy" onClick={handleCopy}>
                Sao chép liên kết
              </div>
            </div>
            <div className="v-bt-sw">
              <div className={`v-bt ${tab === 0 ? 'active' : ''}`} onClick={() => switchTab(0)}>Bình luận (0)</div>
              <div className={`v-bt ${tab === 1 ? 'active' : ''}`} onClick={() => switchTab(1)}>Video của nhà sáng tạo</div>
            </div>
          </div>
        ) :
          (
            <></>
          )}
        {tab === 0 ? (
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
          </div>)
          : (
            <div className="v-video-section">
              {videos.map((v, index) => (
                <VideoCardOnProfile key={index} video={v} id={id} />
              ))}
            </div>
          )}
      </div>
      {tab === 0 && <div className="video-footer-cmt">
        {user ? (
          <div className="video-ft-input-cmt">
            <InputComment isClose={inputMain} />
          </div>
        ) : (
          <div className="video-bt-login-cmt" onClick={() => setIsLoginOpen(true)}>
            Đăng nhập để bình luận
          </div>
        )}
      </div>}
      <PrivacyVideoSettings video={video} isOpen={isOpenSettingPrivacy} setIsOpen={setIsOpenSettingPrivacy}/>
    </div>
  );
};

export default ContentVideoProfile;