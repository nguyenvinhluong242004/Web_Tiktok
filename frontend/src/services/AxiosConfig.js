import axios from "axios";
import { refreshToken } from "./AuthService";

const api = axios.create({
  baseURL: "http://localhost:5281/api",
  withCredentials: true, // Quan trọng: gửi cookie chứa refresh_token
});

// Biến lưu access token
let accessToken = null;
let isRefreshing = false; // Tránh nhiều request refresh cùng lúc
let refreshSubscribers = [];

// Hàm set access token
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("accessToken", token); // Lưu token vào localStorage
  console.log("ac_tk: ", accessToken);
};

// Thêm interceptor để đính kèm access token vào request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
        console.log("ac_tk: ", accessToken);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý khi API trả về lỗi 401 (Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đã có một request refresh đang chạy, chờ token mới rồi retry
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (!newToken) {
          throw new Error("Failed to refresh token");
        }

        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Gọi lại các request bị chờ
        refreshSubscribers.forEach((callback) => callback(newToken));
        refreshSubscribers = [];

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const getAccessToken = () => {
    if (!accessToken) {
        accessToken = localStorage.getItem("accessToken"); // Lấy lại từ localStorage
    }
    return accessToken;
};

export default api;
