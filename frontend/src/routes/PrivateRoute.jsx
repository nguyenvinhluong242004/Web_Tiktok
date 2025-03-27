import { Routes, Route } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import Navbar from "../components/layout/Navbar";

const privateRoutes = [
    { path: "/up", element: <Navbar /> },
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
