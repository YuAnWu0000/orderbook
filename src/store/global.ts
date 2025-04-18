import { create } from "zustand";

interface DialogButton {
  name: string;
  variant: string;
  event: () => void;
}

interface DialogData {
  title: string;
  body: string;
  buttons: DialogButton[];
}

interface GlobalState {
  isLoading: boolean;
  isDialogOpen: boolean;
  customDialog: {
    name: string;
    props: object;
  };
  dialogData: DialogData;
  toggleDialog: () => void;
  setDialogData: (data: DialogData) => void;
  setCustomDialog: (name: string, props: object) => void;
}

const useGlobalStore = create<GlobalState>()((set, get) => ({
  isLoading: false,
  isDialogOpen: false,
  customDialog: {
    name: "",
    props: {},
  },
  dialogData: {
    title: "",
    body: "",
    buttons: [
      {
        name: "取消",
        variant: "secondary",
        /* eslint-disable @typescript-eslint/no-empty-function */
        event: () => {},
      },
      {
        name: "確認",
        variant: "primary",
        /* eslint-disable @typescript-eslint/no-empty-function */
        event: () => {},
      },
    ],
  },
  toggleDialog: () => set((state) => ({ isDialogOpen: !state.isDialogOpen })),
  setDialogData: (data) => {
    get().setCustomDialog("", {});
    /* eslint-disable @typescript-eslint/no-unused-vars */
    return set((state) => ({ dialogData: data }));
  },
  setCustomDialog: (name, props) =>
    /* eslint-disable @typescript-eslint/no-unused-vars */
    set((state) => ({ customDialog: { name, props: props ? props : {} } })),
}));
export default useGlobalStore;
