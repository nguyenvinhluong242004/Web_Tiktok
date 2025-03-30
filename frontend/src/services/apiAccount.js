import { register, login, logout } from "./auth/AuthService";

export const handleRegister = async (email, password, day, year, month) => {
    // Đảm bảo định dạng YYYY-MM-DD chuẩn
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");

    const userData = {
        email,
        password,
        dateOfBirth: `${year}-${formattedMonth}-${formattedDay}`,
    };
    try {
        console.log(email, password)
        const res = await register(userData);
        if (res.error) {
            alert("Đăng ký thất bại: " + res.error);
        } else {
            alert("Đăng ký thành công!");
        }
    } catch (error) {
        console.error("Register error:", error);
        alert("Register failed due to an error.");
    }
};

export const handleLogin = async (email, password) => {
    try {
        console.log(email, password)
        const res = await login(email, password);
        if (res) {
            localStorage.setItem("user", JSON.stringify({ email }));
            //window.location.reload();
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
        //window.location.href = "/"; // Chuyển hướng về trang đăng nhập
    } catch (error) {
        alert("Logout failed!");
    }
};



