import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoCard from "../components/layout/VideoCard";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../store/AppData";
import "../styles/Profile.css";

const Profile = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, resetIsNewVideo, isCommentOpen, isExpand } = useAppState();

    const [activeTab, setActiveTab] = useState(1);
    const [activeFilter, setActiveFilter] = useState(1);

    const moveTab = (index) => {
        setActiveTab(index);
    };

    const moveFilter = (index) => {
        setActiveFilter(index);
    };


    return (
        <div className="container profile-container">
            {/* Header */}
            <div className="header-prf">
                <div className="avt-prf">
                    <div className="avatar-prf">V</div>
                </div>
                <div className="ct-prf">
                    <div className="prf-name d-flex gap-3 mb-1">
                        <h3 className="u-name">van.quan46</h3>
                        <h4 className="fullname">Van Quan</h4>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="btn-prf-change">Sửa hồ sơ</div>
                        <div className="btn-prf">Quảng bá bài đăng</div>
                        <div className="btn-prf"><i class="bi bi-gear-wide"></i></div>
                        <div className="btn-prf"><i class="bi bi-reply" style={{ transform: "scaleX(-1)" }}></i></div>
                    </div>
                    {/* Stats */}
                    <div className="d-flex gap-4 mb-2">
                        <div className=""><b>0</b> Đã follow</div>
                        <div className=""><b>0</b> Follower</div>
                        <div className=""><b>0</b> Lượt thích</div>
                    </div>
                    <div className="des-prf">
                        Chưa có tiểu sử
                    </div>
                </div>
            </div>



            {/* Tabs */}
            <div className="h-prf-tab d-flex justify-content-between">
                {/* Tabs chính */}
                <div className="d-flex prf-tab">
                    {[
                        { id: 0, icon: "bi-list-ul", label: "Video" },
                        { id: 1, icon: "bi-bookmark-heart", label: "Yêu thích" },
                        { id: 2, icon: "bi-heart", label: "Đã thích" }
                    ].map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => moveTab(tab.id)}
                            className={`tab ${activeTab === tab.id ? "active" : ""}`}
                        >
                            <i className={`bi ${tab.icon}`}></i> {tab.label}
                        </div>
                    ))}
                </div>

                {/* Tabs bộ lọc */}
                <div className="d-flex prf-filter-tab">
                    {["Mới nhất", "Thịnh Hành", "Cũ nhất"].map((label, index) => (
                        <div
                            key={index}
                            onClick={() => moveFilter(index)}
                            className={`filter-tab ${activeFilter === index ? "active" : ""}`}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>


            {/* Upload Section */}
            <div className="text-center mt-5">
                <div className="upload-icon">⬜</div>
                <p className="fw-bold">Tải video đầu tiên của bạn lên</p>
                <p>Video của bạn sẽ xuất hiện tại đây</p>
            </div>
        </div>
    );
};

export default Profile;
