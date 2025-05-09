import axios from "axios";
import { API_URL, getAccessToken } from "./config/APIConfig";

// Thêm follow
export const addFollow = async (followerId, followingId) => {
    const token = getAccessToken();
    try {
        const response = await axios.post(
            `${API_URL}/action/add-follower`,
            { followerId, followingId },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm follow:", error.response?.data || error.message);
        throw error;
    }
};

// Xóa follow theo followerId và followingId
export const deleteFollow = async (followerId, followingId) => {
    const token = getAccessToken();
    try {
        await axios.delete(`${API_URL}/action/del-follower`, {
            params: { followerId, followingId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Lỗi khi hủy follow:", error.response?.data || error.message);
        throw error;
    }
};
