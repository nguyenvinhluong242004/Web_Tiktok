export const API_URL = 'http://localhost:5281/api';

// Biến lưu access token
let accessToken = null;
let role = null;

// Hàm set access token
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("accessToken", token); // Lưu token vào localStorage
};

export const getAccessToken = () => {
  if (!accessToken) {
      accessToken = localStorage.getItem("accessToken"); // Lấy lại từ localStorage
  }
  return accessToken;
};

// Hàm set role
export const setRole = (_role) => {
  role = _role;
  localStorage.setItem("role", role); // Lưu role vào localStorage
};

export const getRole = () => {
  if (!role) {
    role = localStorage.getItem("role"); // Lấy lại từ localStorage
  }
  return role;
};

