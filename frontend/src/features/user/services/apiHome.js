import { API_URL } from "./config/APIConfig";

export const fetchVideos = async () => {
    const response = await fetch(`${API_URL}/videos`);
    return response.json();
};