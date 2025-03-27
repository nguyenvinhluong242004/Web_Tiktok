export const isAuthenticated = () => {
    return !!localStorage.getItem("user"); // Kiểm tra xem có thông tin user hay không
  };
  