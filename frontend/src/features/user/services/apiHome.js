import { API_URL } from "./config/APIConfig";
import axios from "axios";

export const fetchVideos = async (uuid) => {
    const response = await axios.post(`${API_URL}/video/feeds`, { uuid: Number(uuid) });
    if (response.status !== 200) {
        throw new Error("Failed to fetch videos");
    }
    return response.data;
};
