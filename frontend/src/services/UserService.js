import { login } from "./AuthService";

export const handleLogin = async (email, password) => {
    try {
        console.log(email, password)
        const res = await login(email, password);
        if (res) {
            localStorage.setItem("user", JSON.stringify({ email })); 
            window.location.reload();
        } else {
            alert("Login failed! Check your email and password.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed due to an error.");
    }
};

// const handleLogout = async () => {
//     await logout();
//     localStorage.removeItem("user"); // Xóa user khỏi localStorage
//     navigate("/login");
//   };



