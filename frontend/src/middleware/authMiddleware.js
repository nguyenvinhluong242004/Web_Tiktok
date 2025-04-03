import GetUserStrorage from "../hooks/UseStorage";

export const isAuthenticated = () => {
  const user = GetUserStrorage(); // Lấy thông tin user từ sessionStorage
  console.log("User từ sessionStorage:", user);
  if (user) {
    return true; // Người dùng đã đăng nhập
  }
  return false; // Người dùng chưa đăng nhập
};
