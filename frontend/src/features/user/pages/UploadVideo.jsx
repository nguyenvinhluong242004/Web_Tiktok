import React, { useState, useRef } from "react";
import { useAppState } from "../../../store/UserData";
import { uploadVideo } from "../services/apiVideo";
import GetUserStrorage from "../../../hooks/UseStorage";
import axios from "axios";
import "../styles/UploadVideo.css"; // Đảm bảo file CSS cập nhật theo giao diện

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [isUploading, setIsUploading] = useState(true);
    const [location, setLocation] = useState('');
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // State xem trước video
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const user = GetUserStrorage(); // Lấy thông tin người dùng từ sessionStorage

    // Xử lý khi video đã tải xong
    const handleVideoDone = () => {
        setIsUploading(false); // Đặt trạng thái tải lên thành false khi video đã tải xong
        if (videoRef.current && canvasRef.current) {
            videoRef.current.pause();
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Đảm bảo canvas có kích thước hợp lý
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Chuyển đổi canvas thành ảnh base64
            const imgData = canvas.toDataURL("image/png");
            setPreviewImg(imgData);
            setThumbnail(imgData); // Lưu ảnh bìa vào state thumbnail
        }
        else {
            console.log(videoRef.current);
            console.log(canvasRef.current);
        }
    };


    // Xử lý thay đổi video
    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            setVideoFile(file);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            // Tạo URL tạm thời từ video
            const videoURL = URL.createObjectURL(file);
            setPreviewUrl(videoURL); // Lưu URL video để xem trước
        }
    };

    // Xử lý chọn ảnh bìa
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewImg(URL.createObjectURL(file))
        }
    };

    // Xử lý tải video lên
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            alert("Vui lòng chọn một video!");
            return;
        }

        setIsUploading(true);

        // Tách phần base64 data (loại bỏ phần header "data:image/png;base64,")
        const base64Data = thumbnail.split(",")[1];

        // Chuyển base64 thành dữ liệu nhị phân
        const byteCharacters = atob(base64Data);

        // Tạo byte array từ chuỗi nhị phân
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset++) {
            const byteArray = byteCharacters.charCodeAt(offset);
            byteArrays.push(byteArray);
        }

        const byteArray = new Uint8Array(byteArrays);

        // Tạo một tệp (file) từ byte array
        const file = new File([byteArray], "image.png", { type: "image/png" });

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("thumbnail", file);
        formData.append("description", description);
        formData.append("visibility", visibility);
        formData.append("location", location);
        formData.append("userid", user.uuid);

        // Duyệt qua và log từng cặp khóa/giá trị trong formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            const response = await uploadVideo(formData);
            if (response) {
                console.log("Video tải lên thành công!");
            } else {
                console.log("Tải lên thất bại.");
            }
        } catch (error) {
            alert("Lỗi khi tải video.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleInput = (e) => {
        e.target.style.height = "auto"; // Đặt lại height về auto
        e.target.style.height = e.target.scrollHeight + "px"; // Cập nhật chiều cao theo nội dung
    };

    const handleInsertText = (symbol) => {
        setDescription((prev) => {
            console.log(prev.length)
            // Kiểm tra nếu ký tự cuối cùng không phải là khoảng trắng
            if (prev.length > 0 && prev.slice(-1) !== ' ') {
                return prev + ' ' + symbol; // Thêm khoảng trắng trước ký tự mới
            }
            return prev + symbol; // Nếu ký tự cuối là khoảng trắng, chỉ thêm symbol
        });
    };

    return (
        <div className="upload-video-container">
            <h3 className="upload-header">Tải video lên</h3>

            <form onSubmit={handleSubmit} className="upload-form">
                {/* Chọn video */}
                <div className="upload-field">
                    <label>Chọn video:</label>

                    {/* Nút tùy chỉnh */}
                    {videoFile ? (
                        <button
                            type="button"
                            className="custom-file-button"
                            onClick={() => document.getElementById('video-input').click()}
                        >
                            <i className="bi bi-arrow-repeat"></i> Thay đổi
                        </button>) : (
                        <button
                            type="button"
                            className="custom-file-button"
                            onClick={() => document.getElementById('video-input').click()}
                        >
                            <i className="bi bi-box-arrow-up"></i> Chọn video
                        </button>
                    )}

                    {/* Nút input file ẩn */}
                    <input
                        type="file"
                        accept="video/*"
                        id="video-input"
                        onChange={handleVideoChange}
                        style={{ display: "none" }}
                    />
                </div>
                <hr />

                <div className="main-upload">
                    <div className="left-main-upload">
                        <h5>Chi tiết</h5>
                        <div className="ct-main-upload">
                            {/* Mô tả video */}
                            <div className="upload-field mt-1 description-input">
                                <label className="mb-2">Mô tả:</label>
                                <textarea value={description} onInput={handleInput} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả..." />
                                <div className="bt-hashtag" onClick={() => handleInsertText("#")}># Hashtag</div>
                                <div className="bt-call" onClick={() => handleInsertText("@")}>@ Nhắc đến</div>

                            </div>

                            {/* Ảnh bìa */}
                            <div className="upload-field">
                                <label>Ảnh bìa:</label>
                                <div className="thumbnail-main">
                                    {previewImg ? (
                                        <img src={previewImg} alt="Preview" style={{ marginTop: "10px", maxWidth: "170px", height: "auto", borderRadius: "10px" }} />
                                    ) : (
                                        <div className="no-video-choose" />)}
                                    {/* Nút tùy chỉnh */}
                                    <button
                                        type="button"
                                        className="custom-img-button"
                                        onClick={() => document.getElementById('thumbnail-input').click()}
                                    >
                                        Sửa ảnh bìa
                                    </button>
                                    {/* Nút input file ẩn */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="thumbnail-input"
                                        onChange={handleThumbnailChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>



                            {/* Địa điểm */}
                            <div className="upload-field">
                                <label>Vị trí:</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Nhập địa điểm..." />
                            </div>

                            {/* Cài đặt quyền riêng tư */}
                            <div className="upload-field mt-2 mb-5">
                                <label>Ai có thể xem video?</label>
                                <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                                    <option value="public">Mọi người</option>
                                    <option value="private">Riêng tư</option>
                                    <option value="friends">Chỉ bạn bè</option>
                                </select>
                            </div>

                            {/* Nút đăng */}
                            <button type="submit" className="upload-button upload-button-done" disabled={isUploading}>
                                {!videoFile ? "Chưa có video" : isUploading ? "Đang tải lên..." : "Đăng"}
                            </button>

                            {/* Nút đăng */}
                            <button type="submit" className="upload-button upload-button-store" disabled={isUploading}>
                                {!videoFile ? "Chưa có video" : isUploading ? "Đang tải lên..." : "Lưu bản nháp"}
                            </button>
                        </div>
                    </div>
                    <div className="right-main-upload">
                        <h5 className="">Preview</h5>
                        <div className="bt-opt-preview">
                            <div className="on-feed">Bảng tin</div>
                            <div className="on-profile">Hồ sơ</div>
                            <div className="on-web">Web/TV</div>
                        </div>
                        {/* Xem trước video */}
                        <div className="display-preview"
                            onMouseEnter={() => setShowControls(true)} // Hover vào: Hiện controls
                            onMouseLeave={() => setShowControls(false)} // Rời chuột: Ẩn controls
                        >
                            {previewUrl && (
                                <div className="video-preview">
                                    {/* Lớp phủ đen nhẹ khi hover */}
                                    {showControls && <div className="overlay"></div>}
                                    <video width="250" ref={videoRef}
                                        onLoadedData={handleVideoDone}
                                        autoPlay key={previewUrl}
                                        controls={showControls} // Hiển thị controls dựa vào state
                                    >
                                        <source className="controls-prv" src={previewUrl} type="video/mp4" />
                                        Trình duyệt của bạn không hỗ trợ video.

                                    </video>
                                    <canvas ref={canvasRef} style={{ display: "none" }} />
                                </div>
                            )}

                            <div className="icon-prv">
                                <img src={user.profileImage} alt="avt" className="prv-avt" />
                                <img src={user.profileImage} alt="avt" className="prv-song" />

                                <div className="prv-add-follow"><span>+</span></div>

                                <div className="prv-name">{user.username}</div>
                                <div className="prv-description">{description}</div>

                                <div className="prv-name-song">
                                    <i class="bi bi-music-note-beamed"></i>
                                    <span className="prv-name-song-main">Âm thanh gốc -
                                        <span className="prv-name-song-name"> {user.username}</span>
                                    </span>
                                </div>

                                <i className="bi bi-broadcast-pin prv-icon-live"></i>
                                <i className="bi bi-battery-full"></i>
                                <i className="bi bi-wifi-2"></i>
                                <i className="bi bi-bar-chart-fill"></i>
                                <i className="bi bi-search"></i>
                                <div className="prv-heart">

                                    <i className="bi bi-heart-fill"></i>
                                    <div>...</div>
                                </div>
                                <div className="prv-chat-dots">
                                    <i className="bi bi-chat-dots-fill"></i>
                                    <div>...</div>
                                </div>
                                <div className="prv-bookmark">
                                    <i className="bi bi-bookmark-fill"></i>
                                    <div>...</div>
                                </div>
                                <div className="prv-reply">
                                    <i className="bi bi-reply-fill"></i>
                                    <div>...</div>
                                </div>
                                <div className="prv-home">
                                    <i className="bi bi-house-door-fill"></i>
                                    <div>Home</div>
                                </div>
                                <div className="prv-people">
                                    <i className="bi bi-people"></i>
                                    <div>Friends</div>
                                </div>
                                <i className="bi bi-plus-square-fill"></i>
                                <div className="prv-chat">
                                    <i className="bi bi-chat-square-dots"></i>
                                    <div>Inbox</div>
                                </div>
                                <div className="prv-person">
                                    <i className="bi bi-person"></i>
                                    <div>Me</div>
                                </div>
                                <div className="prv-fl">Following</div>
                                <div className="prv-fy">For You</div>
                                <div className="prv-time">17:04</div>
                                <i className="bi bi-dash-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadVideo;
