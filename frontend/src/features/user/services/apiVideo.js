import { API_URL, getAccessToken } from "./config/APIConfig";
import axios from "axios";

export const uploadVideo = async (formData, uid) => {
    const token = getAccessToken(); // Lấy token từ sessionStorage hoặc cookie
    try {
        const response = await axios.post(`${API_URL}/video/upload-video`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Vì chúng ta đang gửi dữ liệu đa phần là file
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data.message);
        alert("Tải video lên thành công!");
        window.location.href = `/@${uid}/video/${response.data.videoId}`; // Điều hướng đến trang video sau khi tải lên thành công
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải video:", error);
        alert("Tải video lên thất bại");
        throw error;
    }
};

export const changeVisibility = async (formData) => {
    const token = getAccessToken(); // Lấy token từ sessionStorage hoặc cookie
    try {
        const response = await axios.put(`${API_URL}/video/update-visibility`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Vì chúng ta đang gửi dữ liệu đa phần là file
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data.message);
    } catch (error) {
        console.error("Lỗi khi tải video:", error);
        throw error;
    }
};

// Lấy profile
export const getVideoOfUser = async (uid) => {
    const token = getAccessToken();
    try {
        const response = await axios.get(`${API_URL}/video/${uid}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

        console.log("Kết quả:", response.data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Lỗi đăng ký:", error.response?.data || error.message);
        return { status: false };
    }
};