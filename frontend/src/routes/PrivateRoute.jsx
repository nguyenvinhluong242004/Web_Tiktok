import { Routes, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Profile from "../pages/Profile";

const privateRoutes = [
    { path: "/:uid", element: <Profile /> }, // Hỗ trợ dynamic username
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
