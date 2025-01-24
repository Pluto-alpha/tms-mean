import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskDashboard from "./pages/TaskDashboard";
import NotFound from "./components/NotFound";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<TaskDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
