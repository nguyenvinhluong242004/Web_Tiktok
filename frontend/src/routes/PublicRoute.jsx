import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import UploadImage from "../components/ui/test";

const publicRoutes = [
    { path: "/", element: <Home /> },
    { path: "/upload", element: <UploadImage /> },
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
