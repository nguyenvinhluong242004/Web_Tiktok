import GetUserStrorage from "../hooks/UseStorage";

export const isAuthenticated = () => {
    return !!GetUserStrorage(); // Kiểm tra xem có thông tin user hay không
};
