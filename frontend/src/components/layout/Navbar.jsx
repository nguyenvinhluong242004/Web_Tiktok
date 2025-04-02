import React, { useEffect, useState } from "react";
import CurrentPath from "../hooks/CurrentPath";
import { checkToken, checkRole } from "../../services/apiNavbar";
import { useAppState } from "../../store/AppData";
import ExpandAndMore from "../ui/ExpandAndMore";
import "../../styles/Navbar.css";

import { handleLogout } from "../../services/apiAccount";

function Navbar({ onLoginClick }) {
  const { isExpand, setIsExpand, isSearch, setIsSearch } = useAppState();
  const [isLogin, setIsLogin] = useState(false);
  const currentPath = CurrentPath();
  const movePath = (path) => {
    setIsSearch(false);
    if (isExpand) {
      setIsExpand(false); // Đóng expand nếu đang mở
      setTimeout(() => {
        window.location.href = path; // Chuyển hướng sau khi đóng
      }, 300); // Đợi một chút để hiệu ứng đóng hoàn tất
    } else {
      window.location.href = path; // Chuyển hướng ngay nếu không expand
    }
  };

  const hideExpand = (status) => {
    setIsExpand(status);
    setIsSearch(status);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const result = await checkToken();
      setIsLogin(!!result); // Chuyển kết quả thành true/false
    };
    verifyToken();
    checkRole();
  }, []);

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
        <div to="/up" className="nav-item">
          <i className="bi bi-plus-square"></i>
          <span>Tải lên</span>
        </div>
        <div onClick={() => movePath("/")} className="nav-item">
          <i className="bi bi-camera-reels"></i>
          <span>Live</span>
        </div>
        <div onClick={() => movePath("/profile")} className="nav-item">
          <i className="bi bi-person-fill"></i>
          <span>Hồ sơ</span>
        </div>
        <div onClick={() => setIsExpand(!isExpand)} className="nav-item">
          <i className="bi bi-three-dots"></i>
          <span>Thêm</span>
        </div>

        {isLogin ? (
          <div className="bt-login" onClick={handleLogout}>
            Đăng xuất
          </div>
        ) : (
          <div className="bt-login" onClick={onLoginClick}>
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

      <ExpandAndMore />
    </div>
  );
}

export default Navbar;
