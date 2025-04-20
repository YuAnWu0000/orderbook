import React, { useEffect } from "react";
import Dialog from "@/components/Dialog";
import Dashboard from "./pages/dashboard/Index";

const App: React.FC = () => {
  return (
    <div className="bg-[#586675] text-primary min-h-screen relative overflow-hidden p-4">
      <Dashboard />
      <Dialog />
    </div>
  );
};
export default App;
