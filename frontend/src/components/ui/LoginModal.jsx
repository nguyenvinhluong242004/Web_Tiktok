import React from "react";
import { FaFacebook, FaGoogle, FaLine, FaApple } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { BsQrCode, BsPerson } from "react-icons/bs";
import "../../styles/LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content text-light rounded-3">
                    {/* Header */}
                    <div className="modal-header border-0 d-flex">
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-header border-0 d-flex">
                        <h2 className="modal-title fw-bold mx-auto w-100 text-center">Đăng nhập vào TikTok</h2>
                    </div>

                    {/* Danh sách phương thức đăng nhập */}
                    <div className="modal-body px-5">
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                            <BsQrCode className="fs-5 me-2" /> Sử dụng mã QR <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2" style={{ fontSize: "12px" }}>
                            <BsPerson className="fs-5 me-2" /> Sử dụng số điện thoại/email/tên người dùng <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                            <FaFacebook className="fs-5 me-2 text-primary" /> Tiếp tục với Facebook <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                            <FaGoogle className="fs-5 me-2 text-danger" /> Tiếp tục với Google <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                            <FaLine className="fs-5 me-2 text-success" /> Tiếp tục với LINE <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                            <SiKakaotalk className="fs-5 me-2 text-warning" /> Tiếp tục với KakaoTalk <span style={{ width: "20px" }}></span>
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center">
                            <FaApple className="fs-5 me-2" /> Tiếp tục với Apple <span style={{ width: "20px" }}></span>
                        </button>
                    </div>

                    {/* Chính sách & liên kết */}
                    <div className="ft text-center text-secondary" style={{ fontSize: "12px" }}>
                        <p>
                            Bằng việc tiếp tục với tài khoản có vị trí tại <strong className="text-primary">Việt Nam</strong>, bạn đồng ý với{" "}
                            <a href="/" className="text-decoration-none text-light">Điều khoản dịch vụ</a>, đồng thời xác nhận rằng bạn đã đọc{" "}
                            <a href="/" className="text-decoration-none text-light">Chính sách quyền riêng tư</a> của chúng tôi.
                        </p>
                    </div>
                    <hr />

                    {/* Footer */}
                    <div className="modal-footer border-0 d-flex justify-content-center">
                        <span className="rg">Bạn không có tài khoản? <a href="/" style={{ textDecoration: "none" }} className="text-danger fw-bold">Đăng ký</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
