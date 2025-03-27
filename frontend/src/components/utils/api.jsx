import { getAccessToken, setAccessToken } from "../../services/AxiosConfig";
import axios from "axios";
const API_URL = "http://localhost:5281/api";


export const fetchVideos = async () => {
    const response = await fetch(`${API_URL}/videos`);
    return response.json();
};

// export const checkAccessToken = async () => {
//     console.log("🔍 Đang gọi API check-token...");
//     try {
//         const response = await api.get("/auth/check-token");
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Lỗi kiểm tra token:", error.response?.data?.message || error.message);

//         // Nếu lỗi do token hết hạn, thử refresh token
//         if (error.response?.status === 401) {
//             console.log("Token hết hạn, thử làm mới...");
//             try {
//                 const refreshResponse = await api.post("/auth/refresh-token");
//                 return refreshResponse.data; // Trả về token mới nếu thành công
//             } catch (refreshError) {
//                 console.error("Lỗi refresh token:", refreshError.response?.data?.message || refreshError.message);
//                 return null;
//             }
//         }
//         return null;
//     }
// };

export const checkAccessToken = async () => {
    const token = getAccessToken(); // Lấy token hiện tại
    console.log("Token trước khi gọi API:", token);

    try {
        const response = await axios.get("http://localhost:5281/api/auth/check-token", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true, // Đặt đúng vị trí ở đây
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi kiểm tra token:", error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
            console.log("Token hết hạn, thử làm mới...");
            try {
                const refreshResponse = await axios.post(
                    "http://localhost:5281/api/auth/refresh",
                    {}, // Dữ liệu body (nếu không có thì truyền `{}`)
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true, // Đặt đúng vị trí ở đây
                    }
                );
                console.log(refreshResponse.data);
                setAccessToken(refreshResponse.data.access_token);
                return refreshResponse.data; // Trả về token mới nếu thành công
            } catch (refreshError) {
                console.error("Lỗi refresh token:", refreshError.response?.data?.message || refreshError.message);
                return null;
            }


        }
        return null;
    }
};



