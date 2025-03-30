import { API_URL, setAccessToken, getAccessToken, setRole } from "../config/APIConfig";
import axios from "axios";

// Đăng ký
export const register = async (userData) => {
  try {
    console.log("Dữ liệu gửi đi:", JSON.stringify(userData, null, 2)); // Kiểm tra log

    const response = await axios.post(`${API_URL}/auth/register`, {
      email: userData.email,
      password: userData.password,
      dateOfBirth: userData.dateOfBirth,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Kết quả:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng ký:", error.response?.data || error.message);
    return { error: error.message };
  }
};


// Đăng nhập
export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`,
      {
        email: email,
        password: password
      },
      {
        withCredentials: true
      });
    console.log(res.data)
    setAccessToken(res.data.access_token); // Lưu access token vào memory
    setRole(res.data.role);
    return res.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Đăng xuất
export const logout = async () => {
  const token = getAccessToken(); // Lấy token hiện tại
  try {
    const response = await axios.post(`${API_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    setAccessToken(null); // Xoá access token khỏi memory
    setRole(null);
    return response;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return null;
  }
};

// CheckToken
export const checkAccessToken = async () => {
  const token = getAccessToken();
  console.log("Token Before: ", token);
  try {
    const response = await axios.get(`${API_URL}/auth/check-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    console.log(response.data); // pulic thì .message -> bảo mật
    return response.data;
  } catch (error) {
    console.error("Lỗi kiểm tra token:", error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.log("Token hết hạn, thử làm mới...");
      try {
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log(refreshResponse.data); // pulic thì .message -> bảo mật
        setAccessToken(refreshResponse.data.access_token);
        setRole(refreshResponse.data.role);
        return refreshResponse.data; // Trả về token mới nếu thành công
      } catch (refreshError) {
        console.error("Lỗi refresh token:", refreshError.response?.data?.message || refreshError.message);
        return null;
      }
    }
    return null;
  }
};

// CheckRole
export const checkRoleUser = async (role) => {
  const token = getAccessToken();
  console.log("Token Before: ", token);
  try {
    const response = await axios.get(`${API_URL}/auth/${role}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Không có quyền hạn này!", error.response?.data?.message || error.message);
    return null;
  }
};

