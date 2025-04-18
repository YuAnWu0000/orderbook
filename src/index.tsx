import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "@material-tailwind/react";

const theme = {
  typography: {
    defaultProps: {
      variant: "paragraph",
      color: "primary",
      textGradient: false,
      className: "",
    },
    valid: {
      variants: ["h1", "h2", "h3", "h4", "h5", "h6", "lead", "paragraph", "small"],
      colors: ["primary", "scondary", "success", "error", "info", "warning"],
    },
    styles: {
      variants: {
        h1: {
          display: "block",
          fontSmoothing: "antialiased",
          letterSpacing: "tracking-normal",
          fontFamily: "font-sans",
          fontSize: "text-5xl",
          fontWeight: "font-bold",
          lineHeight: "leading-tight",
        },
        paragraph: {
          fontWeight: "font-normal",
          color: "text-primary",
        },
        small: {
          fontWeight: "font-normal",
          color: "text-primary",
        },
      },
      colors: {
        primary: {
          color: "text-primary",
        },
        secondary: {
          color: "text-secondary",
        },
        success: {
          color: "text-success",
        },
        error: {
          color: "text-error",
        },
        info: {
          color: "text-info",
        },
        warning: {
          color: "text-warning",
        },
      },
    },
  },
  list: {
    defaultProps: {
      ripple: true,
      className: "",
    },
    styles: {
      base: {
        list: {
          color: "text-info",
          fontWeight: "font-medium",
        },
        item: {
          initial: {
            color: "text-info hover:text-primary hover:font-extrabold",
          },
          selected: {
            color: "text-primary",
            fontWeight: "font-extrabold",
          },
        },
      },
    },
  },
  dialog: {
    defaultProps: {
      className: "w-1/3 min-w-[auto] outline-none bg-[#480b1b]",
    },
  },
  dialogHeader: {
    defaultProps: {
      className: "text-primary font-bold text-lg",
    },
  },
  dialogBody: {
    defaultProps: {
      className: "text-primary font-medium text-md text-center py-8",
    },
  },
  input: {
    defaultProps: {
      className: "text-primary font-medium",
    },
    styles: {
      base: {
        container: {
          minWidth: "min-w-[100px] my-5",
        },
      },
      variants: {
        outlined: {
          sizes: {
            md: {
              container: {
                minWidth: "w-36",
              },
              input: {
                fontSize: "text-sm",
                // borderColor: 'border-gray-300',
                // borderTop: 'border-t-gray-300'
              },
              // label: {
              //   display: 'hidden'
              // }
            },
            lg: {
              label: {
                fontSize: "text-base",
              },
              input: {
                fontSize: "text-base",
              },
            },
          },
        },
        static: {
          sizes: {
            // md: {
            //   label: {
            //     color: 'text-info'
            //   },
            //   input: {
            //     fontSize: 'text-md'
            //   }
            // },
            lg: {
              label: {
                fontSize: "text-base",
              },
              input: {
                fontSize: "text-base",
              },
            },
          },
        },
      },
    },
  },
  select: {
    defaultProps: {
      className: "text-primary font-medium",
    },
    styles: {
      base: {
        container: {
          minWidth: "min-w-[100px]",
        },
      },
      // variants: {
      //   outlined: {
      //     size: {
      //       md: {}
      //     }
      //   }
      // }
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
  <ThemeProvider value={theme}>
    <App />
  </ThemeProvider>,
  // </React.StrictMode>,
);
