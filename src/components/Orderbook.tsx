import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import useOrderbookStore from "@/store/orderbook";
import { formatNumberWithCommas } from "@/utils/formatter";

const Orderbook: React.FC = () => {
  const [symbol, setSymbol] = useState("BTCPFC");
  const { orderbook } = useOrderbookStore();
  return (
    <div className="w-[20rem] px-4 py-3 bg-[#131B29] rounded text-right font-normal">
      <h1 className="text-primary font-bold text-left text-xl">Order Book: {symbol}</h1>
      <div className="w-full h-[0.5px] bg-[#8698aa] my-3"></div>
      {/* header */}
      <div className="flex items-center justify-between text-secondary text-sm mb-1">
        <p className="basis-[35%] text-left">Price (USD)</p>
        <p className="basis-[25%]">Size</p>
        <p className="basis-[40%]">Total</p>
      </div>
      {/* sell price */}
      <div className="mb-2">
        {Array.from(orderbook ? orderbook.asks.values() : []).map((item) => (
          <div
            key={`ask${item.price}`}
            className={twMerge(
              "flex items-center justify-between hover:bg-[#1E3059] cursor-pointer",
              item.isNewQuote && "bg-[rgba(255, 91, 90, 0.5)",
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
            <p className="basis-[40%] text-primary">{formatNumberWithCommas(item.total)}</p>
          </div>
        ))}
      </div>
      {/* buy price */}
      <div className="bids">
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
            <p className="basis-[40%] text-primary">{formatNumberWithCommas(item.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orderbook;
