import { Routes, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Profile from "../features/user/pages/Profile";
import UploadVideo from "../features/user/pages/UploadVideo";

const privateRoutes = [
    { path: "/:uid", element: <Profile /> }, // Hỗ trợ dynamic username
    { path: "/upload", element: <UploadVideo /> },
];

const PrivateRoutes = () => {
  return (
      <Routes>
          {privateRoutes.map((route, index) => (
              <Route
                  key={index}
                  path={route.path}
                  element={<AuthRoute>{route.element}</AuthRoute>}
              />
          ))}
      </Routes>
  );
};


export default PrivateRoutes;
