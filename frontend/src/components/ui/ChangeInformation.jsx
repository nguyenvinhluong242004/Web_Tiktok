import React, { useState, useEffect } from "react";
import { changeInformation } from "../../services/apiAccount"; // Import API
import "../../styles/User/ChangeInformation.css";

const ChangeInformation = ({ isOpen, setIsOpen, user }) => {
    const url = "www.tiktok.com";

    const [inputId, setInputId] = useState("");
    const [inputName, setInputName] = useState("");
    const [inputImage, setInputImage] = useState("");
    const [image, setImage] = useState(null);
    const [bio, setBio] = useState("");
    const [isChanged, setIsChanged] = useState(false); // Trạng thái thay đổi

    // Load dữ liệu user khi mở modal
    useEffect(() => {
        if (user) {
            setInputId(user.userid || "");
            setInputName(user.username || "");
            setInputImage(user.profileImage || "");
            setBio(user.bio || "");
            setIsChanged(false);
        }
    }, [user]);

    if (!isOpen) return null;

    // Kiểm tra thay đổi trong input
    const handleChange = (setter, value) => {
        setter(value);
        setIsChanged(true);
    };

    // Xử lý chọn ảnh từ máy
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setInputImage(imageUrl);
            setImage(file);
            setIsChanged(true);
        }
    };

    // Gửi dữ liệu cập nhật qua API
    const handleChangeInformation = async () => {
        const formData = new FormData();
        formData.append("uuid", user.uuid);
        formData.append("userId", inputId);
        formData.append("name", inputName);
        formData.append("bio", bio);
        formData.append("oldImage", user.profileImage);
        if (image) {
            formData.append("newImage", image);
        }

        try {
            await changeInformation(formData);
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
        }
    };

    return (
        <div className="modal-overlay" tabIndex="-1">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header border-0 d-flex justify-content-between">
                    <h4>Sửa hồ sơ</h4>
                    <button
                        type="button"
                        className="btn-close btn-close-white pt-4"
                        onClick={() => setIsOpen(false)}
                    ></button>
                </div>
                <hr />
                <div className="modal-body-change px-4">
                    {/* Ảnh đại diện */}
                    <div className="img-prf d-flex">
                        <h5 className="title">Ảnh hồ sơ</h5>
                        <div className="img-prf-set">
                            {inputImage ? (
                                <img src={inputImage} alt="User Avatar" className="avt-set-prf" />
                            ) : (
                                <div className="avt-set-prf">No Image</div>
                            )}
                            <div className="bt-change-img">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                    id="fileInput"
                                />
                                <label htmlFor="fileInput">
                                    <i className="bi bi-pencil-square"></i>
                                </label>
                            </div>
                        </div>
                    </div>
                    <hr />

                    {/* TikTok ID */}
                    <div className="id-prf d-flex">
                        <h5 className="title">TikTok ID</h5>
                        <div>
                            <textarea
                                type="text"
                                className="input-id"
                                value={inputId}
                                onChange={(e) => handleChange(setInputId, e.target.value)}
                            />
                            <div className="href">{url}/{inputId}</div>
                            <div className="note">
                                TikTok ID chỉ có thể bao gồm chữ cái, chữ số, dấu gạch dưới và dấu chấm. Khi thay đổi TikTok ID, liên kết hồ sơ của bạn cũng sẽ thay đổi.
                            </div>
                        </div>
                    </div>
                    <hr />

                    {/* Tên */}
                    <div className="name-prf d-flex">
                        <h5 className="title">Tên</h5>
                        <div>
                            <textarea
                                type="text"
                                className="input-name"
                                value={inputName}
                                onChange={(e) => handleChange(setInputName, e.target.value)}
                            />
                            <div className="note">Bạn chỉ có thể thay đổi biệt danh 7 ngày một lần.</div>
                        </div>
                    </div>
                    <hr />

                    {/* Tiểu sử */}
                    <div className="img-prf d-flex">
                        <h5 className="title">Tiểu sử</h5>
                        <div>
                            <textarea
                                maxLength={80}
                                onChange={(e) => handleChange(setBio, e.target.value)}
                                value={bio}
                                placeholder="Tiểu sử"
                                type="text"
                                className="input-more"
                            />
                            <div className="counting">{bio.length}/80</div>
                        </div>
                    </div>
                </div>
                <hr />

                {/* Footer */}
                <div className="modal-footer border-0 d-flex justify-content-right px-4 mt-2 mb-3">
                    <button
                        type="button"
                        className="btn btn-dark btn-change-prf"
                        onClick={() => setIsOpen(false)}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="btn btn-dark btn-change-prf"
                        onClick={handleChangeInformation}
                        disabled={!isChanged} // Bật khi có thay đổi
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeInformation;
