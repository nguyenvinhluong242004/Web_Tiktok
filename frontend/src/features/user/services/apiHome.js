import { API_URL } from "./config/APIConfig";
import axios from "axios";

export const fetchVideos = async () => {
    const response = await axios.post(`${API_URL}/video/feeds`);
    return response.data; 
};
