import React from "react";
declare module "*.svg" {
  const type: string;
  export default type;
}
declare module "*.png" {
  const type: string;
  export default type;
}

declare module "*.jpg" {
  const type: string;
  export default type;
}
// see https://github.com/creativetimofficial/material-tailwind/issues/528
declare module "react" {
  interface HTMLAttributes {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler;
    onPointerLeaveCapture?: React.PointerEventHandler;
  }
}
