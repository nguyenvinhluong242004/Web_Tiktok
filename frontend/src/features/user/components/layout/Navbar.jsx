import React, { useEffect, useState } from "react";
import CurrentPath from "../../../../hooks/CurrentPath";
import { checkToken, checkRole } from "../../services/apiNavbar";
import { useAppState } from "../../../../store/UserData";
import GetUserStrorage from "../../../../hooks/UseStorage";
import ExpandAndMore from "../ui/ExpandAndMore";
import { useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";

import { checkProfile, handleLogout } from "../../services/apiAccount";

function Navbar({ reload, setReload }) {
  const { isExpand, setIsExpand, isSearch, setIsCommentOpen, setIsSearch, isLoginOpen, setIsLoginOpen } = useAppState();
  const [isLogin, setIsLogin] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [userid, setUserId] = useState('');

  const navigate = useNavigate(); // Thay thế window.location.href
  const currentPath = CurrentPath();

  const movePath = (path) => {
    setIsSearch(false);
    setIsCommentOpen(false);
    if (path === `/@${userid}` && !isLogin) {
      setIsLoginOpen(true); // Hiển thị modal đăng nhập nếu chưa đăng nhập
      return;
    }
    setReload((prevKey) => !prevKey);
    if (isExpand) {
      setIsExpand(false);
      setTimeout(() => {
        navigate(path); // Dùng navigate thay vì window.location.href
      }, 300);
    } else {
      navigate(path);
    }
  };

  const hideExpand = (status) => {
    setIsExpand(status);
    setIsSearch(status);
  };

  const verifyToken = async () => {
    const result = await checkToken();
    setIsLogin(!!result); // Chuyển kết quả thành true/false
    if (result) {
      const user = await checkProfile(); // Kiểm tra profile
      if (user.status) {
        setUserId(user.data.userid);
        setProfileImage(user.data.profileImage);
        setIsLogin(true);
      }
      else {
        setIsLogin(false);
      }
    }
  };

  useEffect(() => {
    verifyToken();
    checkRole();
  }, [reload]);

  return (
    <div className="ct-navbar">
      <div className={`navbar ${isExpand ? "expand" : ""}`}>
        <div style={{ height: "1px" }}></div>
        <div>
          <div onClick={() => movePath("/")} className="nav-item-logo">
            <i className="bi bi-tiktok"></i>
            <span className="t-tiktok">TikTok</span>
          </div>
        </div>
        <div onClick={() => hideExpand(!isSearch)} className="bt-search-container">
          <i className="bi bi-search bt-search-icon"></i><span> Tìm kiếm</span>
        </div>
        <div onClick={() => movePath("/")} className={`nav-item ${currentPath === "/" ? "active" : ""}`}>
          <i className="bi bi-house-door-fill"></i>
          <span>Đề xuất</span>
        </div>
        <div onClick={() => movePath("/")} className="nav-item">
          <i className="bi bi-slash-circle"></i>
          <span>Khám phá</span>
        </div>
        <div onClick={() => movePath("/")} className="nav-item">
          <i className="bi bi-person-fill-check"></i>
          <span>Đã follow</span>
        </div>
        {!isLogin ? (
          <>
            <div onClick={() => movePath("/upload")} className="nav-item">
              <i className="bi bi-plus-square"></i>
              <span>Tải lên</span>
            </div>
            <div onClick={() => movePath("/")} className="nav-item">
              <i className="bi bi-camera-reels"></i>
              <span>Live</span>
            </div>
          </>
        ) : (
          <>
            <div onClick={() => movePath("/")} className="nav-item">
              <i className="bi bi-people-fill"></i>
              <span>Bạn bè</span>
            </div>
            <div onClick={() => movePath("/upload")} className="nav-item">
              <i className="bi bi-camera-reels"></i>
              <span>Tải lên</span>
            </div>
            <div onClick={() => movePath("/")} className="nav-item">
              <i className="bi bi-chat-square-dots"></i>
              <span>Hoạt động</span>
            </div>
            <div onClick={() => movePath("/")} className="nav-item">
              <i className="bi bi-send"></i>
              <span>Tin nhắn</span>
            </div>
            <div onClick={() => movePath("/")} className="nav-item">
              <i className="bi bi-camera-reels"></i>
              <span>Live</span>
            </div>
          </>
        )}
        <div onClick={() => movePath(`/@${userid}`)} className={`nav-item ${currentPath === `/@${userid}` ? "active" : ""}`}>
          {isLogin ? (
            <>
              {
                profileImage ? (
                  <img src={profileImage || "/path/to/default-avatar.png"} alt="User Avatar" className="avt-icon" />
                ) : (
                  <div className="avt-icon"></div>
                )}
            </>
          ) : (
            <i className="bi bi-person-fill"></i>
          )

          }
          <span>Hồ sơ</span>
        </div>
        <div onClick={() => {
          setIsSearch(false);
          setIsExpand(!isExpand);
        }} className="nav-item">
          <i className="bi bi-three-dots"></i>
          <span>Thêm</span>
        </div>

        {isLogin ? (
          <></>
        ) : (
          <div className="bt-login" onClick={() => {
            setIsLoginOpen(true);
          }}>
            Đăng nhập
          </div>
        )}

        <hr className="line" />

        <span className="t-nav">Công ty</span>
        <span className="t-nav">Chương trình</span>
        <span className="t-nav">Điều khoản và chính sách</span>
        <span className="t-nav-cp">Thêm</span>
        <span className="t-nav-cp"><i className="bi bi-c-circle"></i> <span>2025 TikTok</span></span>

      </div>

      <ExpandAndMore isLogin={isLogin} handleLogout={handleLogout} />
    </div>
  );
}

export default Navbar;
