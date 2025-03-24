import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div style={{height: "10px"}}></div>
      <div>
        <Link to="/" className="nav-item-logo">
          <i className="bi bi-tiktok"></i>
          <span className="t-tiktok">TikTok</span>
        </Link>
      </div>
      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input type="text" className="search-input" placeholder="Tìm kiếm" />
      </div>
      <Link to="/" className="nav-item">
        <i class="bi bi-house-door-fill"></i>
        <span>Đề xuất</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-slash-circle"></i>
        <span>Khám phá</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-person-fill-check"></i>
        <span>Đã follow</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-plus-square"></i>
        <span>Tải lên</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-camera-reels"></i>
        <span>Live</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-person-fill"></i>
        <span>Hồ sơ</span>
      </Link>
      <Link to="/" className="nav-item">
        <i class="bi bi-three-dots"></i>
        <span>Thêm</span>
      </Link>

      <div className="bt-login">
        Đăng nhập
      </div>

      <hr className="line" />

      <span className="t-nav">Công ty</span>
      <span className="t-nav">Chương trình</span>
      <span className="t-nav">Điều khoản và chính sách</span>
      <span className="t-nav-cp">Thêm</span>
      <span className="t-nav-cp"><i class="bi bi-c-circle"></i> <span>2025 TikTok</span></span>
      

    </div>
  );
}

export default Navbar;
