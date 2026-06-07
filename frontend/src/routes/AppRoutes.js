import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Courts from "../pages/Courts";
import CourtDetail from "../pages/CourtDetail";
import CreateMatch from "../pages/CreateMatch";
import Matches from "../pages/Matches";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Register from "../pages/Register";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courts" element={<Courts />} />
      <Route path="/courts/:id" element={<CourtDetail />} />
      <Route path="/courts/:id/create-match" element={<CreateMatch />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;