import React, { useEffect } from "react";
import Dialog from "@/components/Dialog";
import useWebSocketStore from "@/store/ws";
import Dashboard from "./pages/dashboard/Index";

const App: React.FC = () => {
  const { initWebSocket } = useWebSocketStore();
  useEffect(() => {
    initWebSocket({
      op: "subscribe",
      args: ["update:BTCPFC_0", "tradeHistoryApi:BTCPFC"],
    });
  }, []);
  return (
    <div className="bg-[#586675] text-primary min-h-screen relative overflow-hidden p-4">
      <Dashboard />
      <Dialog />
    </div>
  );
};
export default App;
