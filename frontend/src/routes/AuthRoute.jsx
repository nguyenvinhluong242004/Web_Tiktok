import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../middleware/authMiddleware";
import { useAppState } from "../store/UserData";

const PrivateRoute = ({ children }) => {
  const { setIsLoginOpen } = useAppState();
  const navigate = useNavigate();
  const check = isAuthenticated();

  if (check){
    return children;
  }
  else {
    //navigate("/", { replace: true }); // Sử dụng replace: true để tránh tải lại
    setIsLoginOpen(true);
    return null; // Hoặc có thể trả về một thông báo hoặc component khác
  }
};

export default PrivateRoute;
