import { useLocation } from "react-router-dom";

function CurrentPath() {
  const location = useLocation();
  return location.pathname; // Trả về đường dẫn hiện tại, ví dụ: "/home"
}

export default CurrentPath;