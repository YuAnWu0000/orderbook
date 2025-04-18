import { create } from "zustand";

type QuoteRawData = [string, string][];
type QuoteState = {
  isNewQuote: boolean;
  sizeChange: null | "increase" | "decrease";
  price: string;
  size: string;
};
interface OrderbookResponse {
  asks: QuoteRawData;
  bids: QuoteRawData;
  prevSeqNum: number;
  seqNum: number;
  symbol: string;
  timestamp: number;
  type: "snapshot" | "delta";
}

interface Orderbook {
  asks: Map<string, QuoteState>;
  bids: Map<string, QuoteState>;
  prevSeqNum: number;
  seqNum: number;
  symbol: string;
  timestamp: number;
  type: "snapshot" | "delta";
}
const DISPLAY_NUMBER = 8;

interface OrderbookState {
  orderbook: null | Orderbook;
  handleOrderbook: (data: OrderbookResponse) => void;
  createOrderbook: (newQuotes: QuoteRawData, previousMap?: Map<string, QuoteState>) => Map<string, QuoteState>;
}

const useOrderbookStore = create<OrderbookState>()((set, get) => ({
  orderbook: null,
  handleOrderbook: (data) => {
    if (data.type === "delta") {
      set(() => ({
        orderbook: {
          ...data,
          asks: get().createOrderbook(
            data.asks.filter((quote) => quote[1] !== "0").slice(0 - DISPLAY_NUMBER),
            get().orderbook?.asks,
          ),
          bids: get().createOrderbook(
            data.bids.filter((quote) => quote[1] !== "0").slice(0, DISPLAY_NUMBER),
            get().orderbook?.bids,
          ),
        },
      }));
    } else if (data.type === "snapshot") {
      set(() => ({
        orderbook: {
          ...data,
          asks: get().createOrderbook(data.asks.slice(0 - DISPLAY_NUMBER)),
          bids: get().createOrderbook(data.bids.slice(0, DISPLAY_NUMBER)),
        },
      }));
    }
  },
  createOrderbook: (newQuotes, previousMap) => {
    const newMap = new Map();
    newQuotes.forEach((quote) => {
      const previous = previousMap?.get(quote[0]);
      newMap.set(quote[0], {
        isNewQuote: Boolean(previous),
        sizeChange:
          previous && quote[1] !== previous.size ? (quote[1] > previous.size ? "increase" : "decrease") : null,
        price: quote[0],
        size: quote[1],
      });
    });
    return newMap;
  },
}));
export default useOrderbookStore;
