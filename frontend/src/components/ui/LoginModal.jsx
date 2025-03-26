import React, { useState } from "react";
import Select from 'react-select';
import { FaFacebook, FaGoogle, FaLine, FaApple, FaDivide } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { BsQrCode, BsPerson } from "react-icons/bs";
import "../../styles/LoginModal.css";

const optionsMonth = [...Array(12).keys()].map((m) => ({
    value: m + 1,
    label: `Tháng ${m + 1}`,
}));

const optionsDay = [...Array(31).keys()].map((d) => ({
    value: d + 1,
    label: `Ngày ${d + 1}`,
}));

const optionsYear = [...Array(100).keys()].map((y) => ({
    value: 2024 - y,
    label: `${2024 - y}`,
}));

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "#2a2a2a",
        borderColor: "#444",
        color: "#fff",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#2a2a2a",
    }),
    option: (provided, { isFocused, isSelected }) => ({
        ...provided,
        backgroundColor: isSelected ? "#444" : isFocused ? "#555" : "#2a2a2a",
        color: isSelected ? "#fff" : "#ccc",
        cursor: "pointer",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#fff",
    }),
    indicatorSeparator: () => ({
        display: "none", // Ẩn dấu |
    }),
};

const LoginModal = ({ isOpen, onClose }) => {
    const [swRegister, setSwRegister] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showForgotForm, setShowForgotForm] = useState(false);

    const [dob, setDob] = useState({ day: "", month: "", year: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [agree, setAgree] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content text-light rounded-3">
                    {/* Header */}
                    <div className="modal-header border-0 d-flex justify-content-between">
                        {showLoginForm || showRegisterForm || showForgotForm ? (
                            <div
                                type="button"
                                className="bi bi-chevron-left"
                                onClick={() => {
                                    if (showForgotForm) {
                                        setShowForgotForm(false);
                                    }
                                    else {

                                        setShowLoginForm(false);
                                        setShowRegisterForm(false);
                                    }
                                }}
                            >
                            </div>
                        ) : (<></>)}
                        <button
                            type="button"
                            className="btn-close btn-close-white pt-5"
                            onClick={() => {
                                setSwRegister(false); // Reset về trang đăng nhập khi đóng modal
                                onClose(); // Gọi hàm đóng modal
                            }}
                        ></button>
                    </div>
                    <div className="modal-header border-0 d-flex">
                        <h2 className="modal-title fw-bold mx-auto w-100 text-center">
                            {swRegister
                                ? "Đăng ký TikTok"
                                : showForgotForm
                                    ? "Đặt lại mật khẩu"
                                    : showLoginForm
                                        ? "Đăng nhập"
                                        : showRegisterForm ? "Đăng ký" : "Đăng nhập vào TikTok"}
                        </h2>
                    </div>

                    {/* Danh sách phương thức đăng nhập */}
                    <div className="modal-body px-5">
                        {showLoginForm ? (
                            <>
                                {showForgotForm ? (
                                    <>
                                        <div className="mb-1">
                                            <div className="mb-1">Email</div>
                                            <input type="email" className="form-control txt-login-input mb-2" placeholder="Địa chỉ email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                            <input type="password" className="form-control txt-login-input mb-2" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        </div>
                                        <div className="mb-4 d-flex">
                                            <input type="text" className="form-control txt-login-input" placeholder="Nhập mã gồm 6 chữ số" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                                            <button className="btn btn-outline-secondary ms-2">Gửi mã</button>
                                        </div>

                                        <button className="btn btn-danger w-100">Đặt lại</button>
                                    </>
                                ) : (
                                    <>
                                        {/* Form đăng nhập */}
                                        <div className="mb-3" >
                                            <label className="form-label">Email hoặc Tiktok ID</label>
                                            <input type="text" className="txt-login-input form-control mb-2" placeholder="Email hoặc Tiktok ID" />

                                            <input type="password" className="txt-login-input form-control mb-2" placeholder="Mật khẩu" />

                                            <a href="#" className="text-decoration-none small text-light" onClick={() => setShowForgotForm(true)}>Bạn quên mật khẩu?</a>
                                        </div>
                                        <button className="btn btn-danger w-100 mb-2">Đăng nhập</button>
                                    </>
                                )}
                            </>
                        ) : swRegister ? (
                            <>
                                {showRegisterForm ? (
                                    <>
                                        <div className="mb-1">Vui lòng cho biết ngày sinh của bạn.</div>
                                        <div className="d-flex justify-content-between gap-2 rounded">
                                            <Select
                                                className="date-st"
                                                options={optionsMonth}
                                                styles={customStyles}
                                                value={optionsMonth.find((m) => m.value === dob.month)}
                                                onChange={(e) => setDob({ ...dob, month: e.value })}
                                                placeholder="Tháng"
                                                maxMenuHeight={200} // Giới hạn chiều cao dropdown
                                            />
                                            <Select
                                                className="date-st"
                                                options={optionsDay}
                                                styles={customStyles}
                                                value={optionsDay.find((d) => d.value === dob.day)}
                                                onChange={(e) => setDob({ ...dob, day: e.value })}
                                                placeholder="Ngày"
                                                maxMenuHeight={200}
                                            />
                                            <Select
                                                className="date-st"
                                                options={optionsYear}
                                                styles={customStyles}
                                                value={optionsYear.find((y) => y.value === dob.year)}
                                                onChange={(e) => setDob({ ...dob, year: e.value })}
                                                placeholder="Năm"
                                                maxMenuHeight={200}
                                            />
                                        </div>
                                        <div className="form-check-label mb-1" style={{ color: "gray", fontSize: "12px" }} htmlFor="agree">
                                            Ngày sinh của bạn sẽ không được hiển thị công khai.
                                        </div>

                                        <div className="mb-1">
                                            <div className="mb-1">Email</div>
                                            <input type="email" className="form-control txt-login-input mb-2" placeholder="Địa chỉ email" value={email} onChange={(e) => setEmail(e.target.value)} />

                                            <input type="password" className="form-control txt-login-input mb-2" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="mb-1 d-flex">
                                            <input type="text" className="form-control txt-login-input" placeholder="Nhập mã gồm 6 chữ số" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                                            <button className="btn btn-outline-secondary ms-2">Gửi mã</button>
                                        </div>
                                        <div className="mb-2 form-check">
                                            <input type="checkbox" className="form-check-input bg-dark" id="agree" checked={agree} onChange={() => setAgree(!agree)} />
                                            <div className="" style={{ color: "gray", fontSize: "12px" }} htmlFor="agree">
                                                Nhận nội dung thịnh hành, bản tin, khuyến mại, đề xuất và thông tin cập nhật tài khoản qua email.
                                            </div>
                                        </div>
                                        <button className="btn btn-danger w-100">Đăng ký</button>

                                    </>
                                ) : (
                                    <>
                                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2" onClick={() => setShowRegisterForm(true)}>
                                            <BsPerson className="fs-5 me-2" /> Đăng ký bằng số điện thoại/email <span style={{ width: "20px" }}></span>
                                        </button>
                                        <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                                            <FaGoogle className="fs-5 me-2 text-danger" /> Đăng ký với Google <span style={{ width: "20px" }}></span>
                                        </button>
                                        <button className="btn btn-outline-secondary d-flex align-items-center">
                                            <FaFacebook className="fs-5 me-2 text-primary" /> Đăng ký với Facebook <span style={{ width: "20px" }}></span>
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline-secondary d-flex align-items-center mb-2">
                                    <BsQrCode className="fs-5 me-2" /> Sử dụng mã QR <span style={{ width: "20px" }}></span>
                                </button>
                                <button className="btn btn-outline-secondary d-flex align-items-center mb-2" style={{ fontSize: "12px" }} onClick={() => setShowLoginForm(true)}>
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
                            </>
                        )}
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
                        {swRegister ? (
                            <span className="rg">
                                Bạn đã có tài khoản?{" "}
                                <a href="#" onClick={() => {
                                    setShowRegisterForm(false);
                                    setShowForgotForm(false);
                                    setSwRegister(false);
                                }}
                                    style={{ textDecoration: "none" }} className="text-danger fw-bold">
                                    Đăng nhập
                                </a>
                            </span>
                        ) : (
                            <span className="rg">
                                Bạn không có tài khoản?{" "}
                                <a href="#" onClick={() => {
                                    setShowLoginForm(false);
                                    setShowForgotForm(false);
                                    setSwRegister(true);
                                }}
                                    style={{ textDecoration: "none" }} className="text-danger fw-bold">
                                    Đăng ký
                                </a>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
