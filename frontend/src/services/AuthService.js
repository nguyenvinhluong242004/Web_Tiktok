import api, { setAccessToken } from "./AxiosConfig";

// Đăng nhập
export const login = async (email, password) => {
  try {
    console.log(email, password)
    const res = await api.post("/auth/login", {
      email: email,
      password: password
    });
    console.log(res.data)
    setAccessToken(res.data.access_token); // Lưu access token vào memory
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    await api.post("/auth/logout");
    setAccessToken(null); // Xoá access token khỏi memory
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
  }
};

// Refresh token (gọi tự động khi access token hết hạn)
export const refreshToken = async () => {
  try {
    const res = await api.post("/auth/refresh");
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    }
  } catch (error) {
    console.error("Refresh token failed", error.response?.data || error.message);
    return null;
  }
};
