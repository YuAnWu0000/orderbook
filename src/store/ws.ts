import { create } from "zustand";
import useGlobalStore from "@/store/global";
import useOrderbookStore from "@/store/orderbook";

export interface WebSocketRequest {
  op: "subscribe" | "unsubscribe";
  args: string[];
}

interface WebSocketState {
  wsInstance: WebSocket[];
  initWebSocket: (connectionId: number, endpoint: string | URL, firstMsg?: WebSocketRequest) => void;
  sendSocketMessage: (connectionId: number, msg: WebSocketRequest) => void;
}
// const wsUri = process.env.REACT_APP_WS_API_URL as string | URL;
const useWebSocketStore = create<WebSocketState>()((set, get) => ({
  wsInstance: [],
  initWebSocket(connectionId, endpoint, firstMsg) {
    const socket: WebSocket = new WebSocket(endpoint);
    socket.onopen = () => {
      console.log("websocket connected!");
      if (firstMsg) get().sendSocketMessage(connectionId, firstMsg);
    };
    socket.onmessage = (msg) => {
      const res = JSON.parse(msg.data);
      // error handling
      if (res.errors && Array.isArray(res.errors)) {
        const err = res.errors[0].error;
        const message = err.code in BTSE_ERROR_CODES ? err.message : "BTSE unknown error";
        // error popup
        useGlobalStore.setState({
          isDialogOpen: true,
          dialogData: {
            title: "Error Message",
            body: `BTSE: ${message}`,
            buttons: [
              {
                name: "Confirm",
                variant: "primary",
                event: () => {
                  useGlobalStore.setState({
                    isDialogOpen: false,
                  });
                },
              },
            ],
          },
        });
        return;
      }
      // data handling
      if (res.topic === "update:BTCPFC_0") {
        useOrderbookStore.getState().handleOrderbook(res.data);
      } else if (res.topic === "tradeHistoryApi") {
        useOrderbookStore.getState().handleCurrentPrice(res.data);
      } else console.log("--------------topic not found!!--------------");
    };
    socket.onerror = (err) => {
      console.log("ws on error", err);
    };
    socket.onclose = (event) => {
      console.log("Socket onclose:", event);
      if (event.code in SOCKET_DEFAULT_CLOSE_CODES)
        // error popup
        useGlobalStore.setState({
          isDialogOpen: true,
          dialogData: {
            title: "Error Message",
            body: `WebSocket: ${SOCKET_DEFAULT_CLOSE_CODES[event.code as WSErrorCode]}`,
            buttons: [
              {
                name: "Confirm",
                variant: "primary",
                event: () => {
                  useGlobalStore.setState({
                    isDialogOpen: false,
                  });
                },
              },
            ],
          },
        });
      // ws.close() 並不會立即斷開連線, 會先設定readyState=2(CLOSING)
      // 接著等待前後端進行closing handshake成功後才會觸發onclose callback
      // 最後才會設定readyState = 3(CLOSED)
      // 如果在這段時間內重新登入, 則不能讓他用舊連線斷線重連
      // see: https://github.com/websockets/ws/issues/964
      setTimeout(() => {
        console.log("Reconnecting...");
        get().initWebSocket(connectionId, endpoint, firstMsg);
      }, 5000);
    };
    return set(() => ({
      wsInstance: get().wsInstance.concat([socket]),
    }));
  },
  sendSocketMessage(connectionId, msg) {
    // console.log('msg: ', msg)
    if (get().wsInstance[connectionId]?.readyState === SOCKET_READY_STATE_ENUM.OPEN) {
      get().wsInstance[connectionId]?.send(JSON.stringify(msg));
      // console.log("message sent: ", JSON.stringify(msg));
    }
  },
}));
const SOCKET_READY_STATE_ENUM = {
  CONNECTING: 0, // 'Socket has been created. The connection is not yet open.'
  OPEN: 1, // 'The connection is open and ready to communicate.'
  CLOSING: 2, // 'The connection is in the process of closing.'
  CLOSED: 3, // "The connection is closed or couldn't be opened."
};
// https://github.com/Luka967/WebSocket-close-code
const SOCKET_DEFAULT_CLOSE_CODES = {
  1000: "Normal Closure (Successful operation, connection not required anymore).",
  1001: "Going Away (Browser tab closing, graceful server shutdown).",
  1002: "Protocol error (Endpoint received malformed frame)",
  1003: "Unsupported Data (Endpoint received unsupported frame. e.g. binary-only got text frame, ping/pong frames not handled properly).",
  1005: "No Status Rcvd (Got no close status but transport layer finished normally. e.g. TCP FIN but no previous CLOSE frame).",
  1006: "Abnormal Closure (Transport layer broke. e.g. could not connect, TCP RST).",
  1007: `Invalid frame payload data (Data in endpoint's frame is not consistent. e.g. malformed UTF-8).`,
  1008: "Policy Violation (Generic code not applicable to any other. e.g. is not 1003 nor 1009).",
  1009: "Message Too Big (Endpoint will not process large message).",
  1010: "Mandatory Ext. (Client wanted extension(s) that server did not negotiate).",
  1011: "Internal Error (Unexpected server problem while operating).",
  1012: "Service Restart (Server/service is restarting).",
  1013: `Try Again Later (Temporary server condition forced blocking client's application-based request).`,
  1014: "Bad gateway (Server acting as gateway/proxy got invalid response. Equivalent to HTTP 502).",
  1015: "TLS handshake (Transport layer broke because TLS handshake failed).",
  3000: "Unauthorized (Endpoint must be authorized to perform application-based request. Equivalent to HTTP 401).",
  3003: "Forbidden (Endpoint is authorized but has no permissions to perform application-based request. Equivalent to HTTP 403).",
  3008: "Timeout (Endpoint took too long to respond to application-based request. Equivalent to HTTP 408).",
};
type WSErrorCode = keyof typeof SOCKET_DEFAULT_CLOSE_CODES;

const BTSE_ERROR_CODES = {
  1000: "Market pair provided is currently not supported.",
  1001: "Operation provided is currently not supported.",
  1002: "Invalid request. Please check again your request and provide all information required.",
  1005: "Topic provided does not exist.",
  1007: "User message buffer is full.",
  1008: "Reached maximum failed attempts, closing the session.",
};
export default useWebSocketStore;
