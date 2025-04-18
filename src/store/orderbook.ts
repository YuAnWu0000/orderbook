import { create } from "zustand";

type Orderbook = [number, number][];

interface OrderbookResponse {
  asks: Orderbook;
  bids: Orderbook;
  prevSeqNum: number;
  seqNum: number;
  symbol: string;
  timestamp: number;
  type: "snapshot" | "delta";
}

interface OrderbookState {
  orderbook: null | OrderbookResponse;
  handleOrderbook: (data: OrderbookResponse) => void;
}

const useOrderbookStore = create<OrderbookState>()((set) => ({
  orderbook: null,
  handleOrderbook: async (data) => {
    if (data.type === "delta") return;
    set(() => ({
      orderbook: { ...data, asks: data.asks.slice(-8), bids: data.bids.slice(0, 8) },
    }));
  },
}));
export default useOrderbookStore;
