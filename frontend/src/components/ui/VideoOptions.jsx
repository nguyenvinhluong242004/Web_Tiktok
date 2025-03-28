import React, { useState } from "react";
import "../../styles/VideoOptions.css";


const VideoOptions = ({isOpen, setMenuOpen, setIsClickButton, setShowButton}) => {
    const [autoScroll, setAutoScroll] = useState(false);

    return (
        <div className={`menu-opt position-relative ${isOpen ? "d-block" : "d-none"}`}>
            <ul className="drop-menu-opt dropdown-menu dropdown-menu-dark show" data-bs-display="static" onMouseLeave={() => setMenuOpen(false) && setIsClickButton(false) && setShowButton(false)} >
                <li>
                    <button className="dropdown-item d-flex justify-content-between">
                        <span><i className="bi bi-badge-hd ic-opt"></i> Chất lượng</span> <span>540P</span>
                    </button>
                </li>
                <li>
                    <button className="dropdown-item"><i className="bi bi-badge-cc ic-opt"></i> Phụ đề</button>
                </li>
                <li>
                    <button className="dropdown-item d-flex">
                        <span><i className="bi bi-capslock-fill ic-opt"></i> Cuộn tự động</span>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={autoScroll}
                                onChange={() => setAutoScroll(!autoScroll)}
                            />
                        </div>
                    </button>
                </li>
                <li>
                    <button className="dropdown-item"><i className="bi bi-heartbreak ic-opt"></i> Không quan tâm</button>
                </li>
                <li>
                    <button className="dropdown-item"><i className="bi bi-flag ic-opt"></i> Báo cáo</button>
                </li>
            </ul>
        </div>
    );
};

export default VideoOptions;
