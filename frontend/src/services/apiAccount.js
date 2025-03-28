import { login, logout } from "./auth/AuthService";

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



