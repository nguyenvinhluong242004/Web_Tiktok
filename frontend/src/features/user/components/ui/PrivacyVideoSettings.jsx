import React, { useState, useEffect } from "react";
import "../../styles/PrivacyVideoSettings.css"; // Tạo CSS riêng nếu cần
import { changeVisibility } from "../../services/apiVideo";

const visibilityOptions = {
    public: "Mọi người",
    friends: "Bạn bè",
    private: "Chỉ mình tôi"
};

const PrivacyVideoSettings = ({ video, isOpen, setIsOpen, videoPrivacy }) => {
    const [viewOption, setViewOption] = useState("public");
    const [allowComment, setAllowComment] = useState(true);
    const [allowDuet, setAllowDuet] = useState(false);
    const [allowStitch, setAllowStitch] = useState(false);

    useEffect(() => {
        if (video) {
            setViewOption(video.visibility);
        }
        if (videoPrivacy) {
            setAllowComment(videoPrivacy.allowComment ?? true);
            setAllowDuet(videoPrivacy.allowDuet ?? false);
            setAllowStitch(videoPrivacy.allowStitch ?? false);
        }
        console.log(video.visibility)
    }, [video, videoPrivacy]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const updatedPrivacy = {
            viewOption,
            allowComment,
            allowDuet,
            allowStitch
        };
        console.log("Đã lưu cài đặt:", updatedPrivacy);

        const formData = new FormData();
        formData.append("videoid", video.id);
        formData.append("visibility", updatedPrivacy.viewOption);

        // Duyệt qua và log từng cặp khóa/giá trị trong formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const response = await changeVisibility(formData);
            if (response) {
                console.log("Thay đổi privacy thành công!");
            } else {
                console.log("Thất bại.");
            }
        } catch (error) {
            alert("Lỗi khi thay đổi.");
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <div className="modal-overlay-v" tabIndex="-1">
            <div className="modal-container-v" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header border-0 d-flex justify-content-between">
                    <h4>Cài đặt quyền riêng tư</h4>
                    <button
                        type="button"
                        className="btn-close btn-close-white pt-4"
                        onClick={() => setIsOpen(false)}
                    ></button>
                </div>
                <hr />

                {/* Body */}
                <div className="modal-body-change px-4">
                    {/* Ai có thể xem video */}
                    <div className="privacy-option d-flex align-items-center justify-content-between mb-3">
                        <div>
                            Ai có thể xem video này
                        </div>
                        <select
                            className="form-select w-auto"
                            value={viewOption}
                            onChange={(e) => setViewOption(e.target.value)}
                        >
                            {Object.keys(visibilityOptions).map((key) => (
                                <option key={key} value={key}>
                                    {visibilityOptions[key]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cho phép bình luận */}
                    <div className="privacy-toggle d-flex align-items-center justify-content-between mb-3">
                        <span>Cho phép bình luận</span>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={allowComment}
                                onChange={() => setAllowComment(!allowComment)}
                            />
                        </div>
                    </div>

                    {/* Cho phép Duet và Tương tác */}
                    <div className="privacy-toggle d-flex align-items-center justify-content-between mb-3">
                        <span>Cho phép Duet và Tương tác</span>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={allowDuet}
                                onChange={() => setAllowDuet(!allowDuet)}
                            />
                        </div>
                    </div>

                    {/* Cho phép Ghép nối */}
                    <div className="privacy-toggle d-flex align-items-center justify-content-between mb-3">
                        <span>Cho phép Ghép nối</span>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={allowStitch}
                                onChange={() => setAllowStitch(!allowStitch)}
                            />
                        </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="note-small mt-2">
                        Các video thuộc tài khoản riêng tư không hỗ trợ tính năng Duet và Ghép nối.
                    </div>
                </div>
                <hr />

                {/* Footer */}
                <div className="modal-footer border-0 d-flex justify-content-end px-4 mt-2 mb-3">
                    <button
                        type="button"
                        className="btn btn-dark ms-2"
                        onClick={handleSave}
                    >
                        Xong
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyVideoSettings;
