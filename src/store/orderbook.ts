import { create } from "zustand";
import useWebSocketStore from "@/store/ws";
import { DISPLAY_NUMBER, ORDERBOOK_CONNECTION_ID } from "@/components/Orderbook";

type CurrentPrice = {
  price: number;
  priceChange: null | "increase" | "decrease";
};
interface TradeHistoryResponse {
  price: number;
  side: "SELL" | "BUY";
  size: number;
  symbol: string;
  timestamp: number;
  tradeId: number;
}

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

interface OrderbookState {
  orderbook: null | Orderbook;
  currentPrice: null | CurrentPrice;
  handleCurrentPrice: (data: TradeHistoryResponse[]) => void;
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
  currentPrice: null,
  handleCurrentPrice: (data) => {
    const prevPrice = get().currentPrice;
    const nowPrice = data[0].price;
    set(() => ({
      currentPrice: {
        price: nowPrice,
        priceChange:
          prevPrice && nowPrice !== prevPrice.price ? (nowPrice > prevPrice.price ? "increase" : "decrease") : null,
      },
    }));
    return;
  },
  handleOrderbook: (data) => {
    if (data.type === "delta") {
      const prevOrderbook = get().orderbook;
      if (!prevOrderbook) {
        console.log("Lack of previous orderbook data. Please get snapshot again.");
        return;
      }
      const asks = get().mergeSortedQuotes(
        data.asks.filter((quote) => quote[1] !== "0").sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])),
        // .slice(0 - DISPLAY_NUMBER),
        prevOrderbook.asks ?? new Map(),
        "sell",
      );
      const bids = get().mergeSortedQuotes(
        data.bids.filter((quote) => quote[1] !== "0").sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])),
        // .slice(0, DISPLAY_NUMBER),
        prevOrderbook.bids ?? new Map(),
        "buy",
      );
      // console.log(asks, bids);
      // handle order book error
      if (
        data.prevSeqNum !== prevOrderbook.seqNum ||
        Array.from(bids.keys())[0] > Array.from(asks.keys())[asks.size - 1]
      ) {
        useWebSocketStore.getState().sendSocketMessage(ORDERBOOK_CONNECTION_ID, {
          op: "unsubscribe",
          args: ["update:BTCPFC_0"],
        });
        useWebSocketStore.getState().sendSocketMessage(ORDERBOOK_CONNECTION_ID, {
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
      const [dPrice, dSize] = delta[i];
      const [pPrice, pData] = prevArray[j];
      const d = parseFloat(dPrice),
        p = parseFloat(pPrice);
      if (d > p) {
        result.push([dPrice, { isNewQuote: true, sizeChange: null, price: dPrice, size: dSize }]);
        i++;
      } else if (d < p) {
        result.push([pPrice, { isNewQuote: false, sizeChange: null, price: pPrice, size: pData.size }]);
        j++;
      } else {
        const sizeChange = parseFloat(dSize) > parseFloat(pData.size) ? "increase" : "decrease";
        result.push([dPrice, { isNewQuote: false, sizeChange, price: dPrice, size: dSize }]);
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
