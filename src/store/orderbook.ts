import { create } from "zustand";
import useWebSocketStore from "@/store/ws";

type QuoteRawData = [string, string][];
type QuoteState = {
  isNewQuote: boolean;
  sizeChange: null | "increase" | "decrease";
  price: string;
  size: string;
  total?: number;
  percentage?: number;
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
  createOrderbook: (newQuotes: QuoteRawData, side: "buy" | "sell") => Map<string, QuoteState>;
  mergeSortedQuotes: (
    delta: QuoteRawData,
    prevMap: Map<string, QuoteState>,
    side: "buy" | "sell",
  ) => Map<string, QuoteState>;
  calculateTotalSize: (quoteArr: [string, QuoteState][], side: "buy" | "sell") => [string, QuoteState][];
}

const useOrderbookStore = create<OrderbookState>()((set, get) => ({
  orderbook: null,
  handleOrderbook: (data) => {
    if (data.type === "delta") {
      if (!get().orderbook) {
        console.log("Lack of previous orderbook data. Please get snapshot again.");
        return;
      }
      const asks = get().mergeSortedQuotes(
        data.asks.filter((quote) => quote[1] !== "0").sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])),
        // .slice(0 - DISPLAY_NUMBER),
        get().orderbook?.asks ?? new Map(),
        "sell",
      );
      const bids = get().mergeSortedQuotes(
        data.bids.filter((quote) => quote[1] !== "0").sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])),
        // .slice(0, DISPLAY_NUMBER),
        get().orderbook?.bids ?? new Map(),
        "buy",
      );
      // console.log(asks, bids);
      // handle order book error
      if (
        data.prevSeqNum !== get().orderbook?.seqNum ||
        Array.from(bids.keys())[0] > Array.from(asks.keys())[asks.size - 1]
      ) {
        useWebSocketStore.getState().sendSocketMessage({
          op: "unsubscribe",
          args: ["update:BTCPFC_0"],
        });
        // set(() => ({
        //   orderbook: null,
        // }));
        useWebSocketStore.getState().sendSocketMessage({
          op: "subscribe",
          args: ["update:BTCPFC_0"],
        });
        return;
      }
      set(() => ({
        orderbook: {
          ...data,
          asks,
          bids,
        },
      }));
    } else if (data.type === "snapshot") {
      set(() => ({
        orderbook: {
          ...data,
          asks: get().createOrderbook(data.asks.slice(0 - DISPLAY_NUMBER), "sell"),
          bids: get().createOrderbook(data.bids.slice(0, DISPLAY_NUMBER), "buy"),
        },
      }));
    }
  },
  createOrderbook: (newQuotes, side) => {
    const newArray = newQuotes.map(
      (quote) =>
        [
          quote[0],
          {
            isNewQuote: false,
            sizeChange: null,
            price: quote[0],
            size: quote[1],
          },
        ] as [string, QuoteState],
    );
    return new Map(get().calculateTotalSize(newArray, side));
  },
  mergeSortedQuotes: (delta, prevMap, side) => {
    const prevArray = Array.from(prevMap.entries());
    let i = 0,
      j = 0;
    const result: [string, QuoteState][] = [];
    // console.log(delta, prevMap, side);
    while (i < delta.length && j < prevArray.length) {
      if (parseFloat(delta[i][0]) > parseFloat(prevArray[j][0])) {
        result.push([
          delta[i][0],
          {
            isNewQuote: true,
            sizeChange: null,
            price: delta[i][0],
            size: delta[i][1],
          },
        ]);
        i++;
      } else if (parseFloat(delta[i][0]) < parseFloat(prevArray[j][0])) {
        result.push([
          prevArray[j][0],
          {
            isNewQuote: false,
            sizeChange: null,
            price: prevArray[j][0],
            size: prevArray[j][1].size,
          },
        ]);
        j++;
      } else {
        // price equal
        // console.log("delta", parseFloat(delta[i][1]));
        result.push([
          delta[i][0],
          {
            isNewQuote: false,
            sizeChange: parseFloat(delta[i][1]) > parseFloat(prevArray[j][1].size) ? "increase" : "decrease",
            price: delta[i][0],
            size: delta[i][1],
          },
        ]);
        i++;
        j++;
      }
    }
    // 處理剩餘 delta
    while (i < delta.length) {
      const [price, size] = delta[i];
      result.push([price, { price, size, isNewQuote: true, sizeChange: null }]);
      i++;
    }
    // 處理剩餘 prevArray
    while (j < prevArray.length) {
      const [price, data] = prevArray[j];
      result.push([price, { price, size: data.size, isNewQuote: false, sizeChange: null }]);
      j++;
    }
    // console.log("merge result: ", result);
    // calculate total size
    const newArray = side === "buy" ? result.slice(0, DISPLAY_NUMBER) : result.slice(0 - DISPLAY_NUMBER);
    return new Map(get().calculateTotalSize(newArray, side));
  },
  calculateTotalSize: (quoteArr, side) => {
    let total = 0,
      accumulation = 0;
    const indices = side === "sell" ? [...quoteArr.keys()].reverse() : [...quoteArr.keys()];
    for (const i of indices) {
      total += parseFloat(quoteArr[i][1].size);
    }
    // calculate percentage
    for (const i of indices) {
      accumulation += parseFloat(quoteArr[i][1].size);
      quoteArr[i][1] = {
        ...quoteArr[i][1],
        total: accumulation,
        percentage: Math.round((accumulation * 100) / total) / 100,
      };
    }
    return quoteArr;
  },
}));
export default useOrderbookStore;
