import { checkAccessToken, checkRoleUser } from "./auth/AuthService";

export const checkToken = async () => {
    try {
        const response = await checkAccessToken();
        return response; 
    } catch (error) {
        console.error("Lỗi khi kiểm tra token:", error);
        return null; 
    }
};

export const checkRole = async () => {
    try {
        const response = await checkRoleUser('Censor');
        return response; 
    } catch (error) {
        console.error("Không có quyền hạn", error);
        return null; 
    }
};
