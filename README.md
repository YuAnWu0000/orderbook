# Introduction

本專案為加密貨幣的即時訂單簿Demo，後端串接BTSE websocket API，當訂單簿價格變動時，會出現對應的背景色。

API Doc: https://btsecom.github.io/docs/futures/en/#orderbook-incremental-updates

## Tech Stack

**Initializer:** `create-react-app`<br>

**Frontend Framework:** `react 18`<br>

**Language:** `typescript`<br>

**CSS Framework:** `tailwindcss`<br>

**UI Library:** `material-tailwind`<br>

**State Management:** `zustand`<br>

**Build Tool:** `webpack`<br>

## Commands

### `npm i`

載入相依套件。

### `npm run start`

開啟開發環境，並帶入 `.env.development`。

### `npm run build:uat`

編譯並打包為測試環境，帶入 `.env.uat`。

### `npm run build`

編譯並打包為正式環境，帶入 `.env.production`。
