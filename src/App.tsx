import React, { useEffect } from "react";
import Dialog from "@/components/Dialog";
// import useAuthStore from "@/store/auth";
import useWebSocketStore from "@/store/ws";
import Dashboard from "./pages/dashboard/Index";

const App: React.FC = () => {
  // const { handleSignIn } = useAuthStore();
  const { initWebSocket } = useWebSocketStore();
  useEffect(() => {
    // handleSignIn({
    //   username: "admin",
    //   password: "admin",
    //   protocol: "hkex",
    // });
    initWebSocket({
      op: "subscribe",
      args: ["update:BTCPFC_0", "tradeHistoryApi:BTCPFC"],
    });
  }, []);
  return (
    <div className="bg-[#95a5b6] text-primary min-h-screen relative overflow-hidden p-4">
      <Dashboard />
      <Dialog />
    </div>
  );
};
export default App;
