import { Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage';
import Courts from '../pages/Courts';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courts" element={<Courts />} />
        </Routes>
    );
};

export default AppRoutes;