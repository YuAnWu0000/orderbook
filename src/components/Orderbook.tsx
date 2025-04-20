import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import useWebSocketStore from "@/store/ws";
import useOrderbookStore from "@/store/orderbook";
import { formatNumberWithCommas } from "@/utils/formatter";

export const DISPLAY_NUMBER = 8;
export const ORDERBOOK_CONNECTION_ID = 0;
export const LASTPRICE_CONNECTION_ID = 1;

const Orderbook: React.FC = () => {
  const [symbol, setSymbol] = useState("BTCPFC");
  const { orderbook, currentPrice } = useOrderbookStore();
  const { initWebSocket } = useWebSocketStore();
  useEffect(() => {
    initWebSocket(ORDERBOOK_CONNECTION_ID, process.env.REACT_APP_WS_OSS_API_URL as string | URL, {
      op: "subscribe",
      args: ["update:BTCPFC_0"],
    });
    initWebSocket(LASTPRICE_CONNECTION_ID, process.env.REACT_APP_WS_API_URL as string | URL, {
      op: "subscribe",
      args: ["tradeHistoryApi:BTCPFC"],
    });
  }, []);
  return (
    <div className="w-[20rem] py-3 bg-[#131B29] rounded text-right font-normal">
      {/* title */}
      <h1 className="text-primary font-bold text-left text-xl px-4">Order Book: {symbol}</h1>
      <div className="w-full h-[0.5px] bg-[rgba(255,255,255,0.3)] my-3"></div>
      {/* header */}
      <div className="flex items-center justify-between text-secondary text-sm mb-1 px-4">
        <p className="basis-[35%] text-left">Price (USD)</p>
        <p className="basis-[25%]">Size</p>
        <p className="basis-[40%]">Total</p>
      </div>
      {/* sell price */}
      <div className="mb-2 px-4">
        {Array.from(orderbook ? orderbook.asks.values() : []).map((item) => (
          <div
            key={`ask${item.price}`}
            className={twMerge(
              "flex items-center justify-between hover:bg-[#1E3059] cursor-pointer",
              item.isNewQuote && "bg-[rgba(255,91,90,0.5)",
            )}
          >
            <p className="basis-[35%] text-sell text-left">{formatNumberWithCommas(item.price)}</p>
            <p
              className={twMerge(
                "basis-[25%] text-primary",
                item.sizeChange === "increase" && "bg-[rgba(0,177,93,0.5)]",
                item.sizeChange === "decrease" && "bg-[rgba(255,91,90,0.5)]",
              )}
            >
              {formatNumberWithCommas(item.size)}
            </p>
            <p className="basis-[40%] relative text-primary">
              <div
                className="w-full h-full absolute top-0 right-0 bg-[rgba(255,90,90,0.12)]"
                style={{ width: `${(item.percentage ?? 0) * 100}%` }}
              ></div>
              {formatNumberWithCommas(item.total)}
            </p>
          </div>
        ))}
      </div>
      {/* current price */}
      <div className="w-full text-center my-1">
        <p
          className={twMerge(
            "text-xl text-[#F0F4F8] font-bold bg-[rgba(134,152,170,0.12)] py-1 ",
            currentPrice && currentPrice.priceChange === "increase" && "text-[#00b15d] bg-[rgba(16,186,104,0.12)]",
            currentPrice && currentPrice.priceChange === "decrease" && "text-[#FF5B5A] bg-[rgba(255,90,90,0.12)]",
          )}
        >
          {formatNumberWithCommas(currentPrice?.price)}
          {currentPrice && currentPrice.priceChange === "increase" && <span>↑</span>}
          {currentPrice && currentPrice.priceChange === "decrease" && <span>↓</span>}
        </p>
      </div>
      {/* buy price */}
      <div className="px-4">
        {Array.from(orderbook ? orderbook.bids.values() : []).map((item) => (
          <div
            key={`bid${item.price}`}
            className={twMerge(
              "flex items-center justify-between hover:bg-[#1E3059] cursor-pointer",
              item.isNewQuote && "bg-[rgba(0,177,93,0.5)]",
            )}
          >
            <p className="basis-[35%] text-buy text-left">{formatNumberWithCommas(item.price)}</p>
            <p
              className={twMerge(
                "basis-[25%] text-primary",
                item.sizeChange === "increase" && "bg-[rgba(0,177,93,0.5)]",
                item.sizeChange === "decrease" && "bg-[rgba(255,91,90,0.5)]",
              )}
            >
              {formatNumberWithCommas(item.size)}
            </p>
            <p className="basis-[40%] relative text-primary">
              <div
                className="w-full h-full absolute top-0 right-0 bg-[rgba(16,186,104,0.12)]"
                style={{ width: `${(item.percentage ?? 0) * 100}%` }}
              ></div>
              {formatNumberWithCommas(item.total)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orderbook;
