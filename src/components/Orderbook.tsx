import React, { useState } from "react";
import useOrderbookStore from "@/store/orderbook";

const Orderbook: React.FC = () => {
  const [symbol, setSymbol] = useState("BTCPFC");
  const { orderbook } = useOrderbookStore();
  const [data, setData] = useState({
    bids: [
      ["59252.5", "0.06865"],
      ["59249.0", "0.24000"],
      ["59235.5", "0.16073"],
      ["59235.0", "0.26626"],
      ["59233.0", "0.50000"],
    ],
    asks: [
      ["59292.0", "0.50000"],
      ["59285.5", "0.24000"],
      ["59285.0", "0.15598"],
      ["59278.5", "0.01472"],
      ["59277.5", "0.01555"],
    ],
  });
  return (
    <div className="w-[20rem] px-4 py-3 bg-[#131B29] rounded text-right font-normal">
      <h1 className="text-primary font-bold text-left text-xl">Order Book: {symbol}</h1>
      <div className="w-full h-[0.5px] bg-[#8698aa] my-3"></div>
      {/* header */}
      <div className="flex items-center justify-between text-secondary text-sm mb-1">
        <p className="basis-1/3 text-left">Price (USD)</p>
        <p className="basis-1/3">Size</p>
        <p className="basis-1/3">Total</p>
      </div>
      {/* sell price */}
      <div className="mb-2">
        {Array.from(orderbook ? orderbook.asks.values() : []).map((item) => (
          <div key={`ask${item.price}`} className="flex items-center justify-between">
            <p className="basis-1/3 text-sell text-left">{item.price}</p>
            <p className="basis-1/3 text-primary">{item.size}</p>
            <p className="basis-1/3 text-primary">{1000}</p>
          </div>
        ))}
      </div>
      {/* buy price */}
      <div className="bids">
        {Array.from(orderbook ? orderbook.bids.values() : []).map((item) => (
          <div key={`bid${item.price}`} className="flex items-center justify-between">
            <p className="basis-1/3 text-buy text-left">{item.price}</p>
            <p className="basis-1/3 text-primary">{item.size}</p>
            <p className="basis-1/3 text-primary">{1000}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orderbook;
