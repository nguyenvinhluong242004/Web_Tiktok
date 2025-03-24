const API_URL = "http://localhost:5281/api";

export const fetchVideos = async () => {
    const response = await fetch(`${API_URL}/videos`);
    return response.json();
};
