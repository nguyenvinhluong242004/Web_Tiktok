import { API_URL, getAccessToken } from "./config/APIConfig";
import axios from "axios";

export const uploadVideo = async (formData) => {
    const token = getAccessToken(); // Lấy token từ sessionStorage hoặc cookie
    try {
        const response = await axios.post(`${API_URL}/upload-video`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Vì chúng ta đang gửi dữ liệu đa phần là file
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data.message);
        alert("Tải video lên thành công!");
        window.location.href = `/@${response.data.userProfile.userid}/videos`; // Điều hướng đến trang video sau khi tải lên thành công
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải video:", error);
        alert("Tải video lên thất bại");
        throw error;
    }
};
