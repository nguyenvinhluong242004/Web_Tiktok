import { Routes, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import UploadVideo from "../features/user/pages/UploadVideo";

const privateRoutes = [
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
