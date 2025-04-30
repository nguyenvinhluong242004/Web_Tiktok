import { register, login, logout, sendVerificationCode } from "./auth/AuthService";
import { API_URL, getAccessToken } from "./config/APIConfig";
import axios from "axios";

export const handleRegister = async (email, password, verificationcode, agree, day, year, month, setShowRegisterForm, setShowLoginForm, setSwRegister, setShowForgotForm) => {
    // Kiểm tra định dạng email
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Kiểm tra mật khẩu hợp lệ (tối thiểu 6 ký tự, ít nhất 1 chữ và 1 số)
    const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

    // Kiểm tra mã xác thực (phải có đúng 6 chữ số)
    console.log(verificationcode)
    const isValidCode = (verificationcode) => /^\d{6}$/.test(verificationcode);

    // Kiểm tra email
    if (!isValidEmail(email)) {
        alert("Email không hợp lệ!");
        return;
    }

    // Kiểm tra mật khẩu
    if (!isValidPassword(password)) {
        alert("Mật khẩu phải có ít nhất 6 ký tự, chứa ít nhất một chữ cái và một số.");
        return;
    }

    // Kiểm tra mã xác thực
    if (!isValidCode(verificationcode)) {
        alert("Mã xác thực phải là 6 chữ số.");
        return;
    }

    // Chuyển đổi ngày sinh về định dạng chuẩn YYYY-MM-DD
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    const dateOfBirth = `${year}-${formattedMonth}-${formattedDay}`;

    // Kiểm tra tuổi (phải từ 14 trở lên)
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 14 || (age === 14 && today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()))) {
        alert("Bạn phải từ 14 tuổi trở lên để đăng ký.");
        return;
    }

    // Dữ liệu hợp lệ, tiến hành đăng ký
    const userData = {
        email,
        password,
        verificationcode,
        agree,
        dateOfBirth,
    };

    try {
        console.log(email, password, verificationcode);
        const res = await register(userData);
        if (res.error) {
            alert("Đăng ký thất bại: " + res.error);
        } else {
            alert("Đăng ký thành công!");
            setShowRegisterForm(false); // Đóng form đăng ký
            setShowLoginForm(true); // Mở form đăng nhập
            setShowForgotForm(false); // Đóng form quên mật khẩu
            setSwRegister(false); // Đóng form đăng ký
        }
    } catch (error) {
        console.error("Register error:", error);
        alert("Đăng ký thất bại do lỗi hệ thống.");
    }
};

export const handleSendCode = async (email) => {
    if (!email) {
        alert("Vui lòng nhập email trước khi yêu cầu mã.");
        return;
    }

    try {
        const res = await sendVerificationCode(email);
        console.log("Phản hồi API:", res);

        if (res?.message) { // 🔥 Kiểm tra `message` đúng cách
            alert(res.message);
        } else {
            alert("Không thể gửi mã xác thực. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Lỗi khi gửi mã:", error);
        alert("Lỗi hệ thống, không thể gửi mã.");
    }
};

export const handleLogin = async (email, password) => {
    try {
        console.log(email, password)
        const res = await login(email, password);
        console.log(res)
        if (res) {
            sessionStorage.setItem("user", JSON.stringify(res.user));
            window.location.href = `/@${res.user.userid}`; // Chuyển hướng về trang cá nhân của người dùng
        } else {
            alert("Login failed! Check your email and password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed due to an error.");
    }
};

export const handleLogout = async () => {
    try {
        const res = await logout();
        console.log(res);
        sessionStorage.removeItem("user");
        window.location.href = "/"; // Chuyển hướng về trang đăng nhập
    } catch (error) {
        alert("Logout failed!");
    }
};

// Lấy profile
export const getProfile = async (uid) => {
    const token = getAccessToken();
    try {
        const response = await axios.get(`${API_URL}/${uid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

        console.log("Kết quả:", response.data);
        return { status: true, data: response.data.userProfile };
    } catch (error) {
        console.error("Lỗi đăng ký:", error.response?.data || error.message);
        return { status: false };
    }
};

// Lấy profile
export const checkProfile = async () => {
    const token = getAccessToken();
    try {
        const response = await axios.post(`${API_URL}/check-profile`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

        //console.log("Kết quả:", response.data);
        sessionStorage.setItem("user", JSON.stringify(response.data.userProfile));
        return { status: true, data: response.data.userProfile };
    } catch (error) {
        console.error("Lỗi đăng ký:", error.response?.data || error.message);
        return { status: false };
    }
};

export const changeInformation = async (formData) => {
    const token = getAccessToken();
    try {
        const response = await axios.put(`${API_URL}/update-profile`, formData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data.message);
        sessionStorage.setItem("user", JSON.stringify(response.data.userProfile));
        alert("Cập nhật thông tin thành công");
        window.location.href = `/@${response.data.userProfile.userid}`;
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        alert("Cập nhật thông tin thất bại");
        throw error;
    }
};

