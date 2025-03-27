import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";

const publicRoutes = [
    { path: "/", element: <Home /> },
];

const PublicRoutes = () => {
    return (
        <Routes>
            {publicRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                />
            ))}
        </Routes>
    );
};


export default PublicRoutes;
