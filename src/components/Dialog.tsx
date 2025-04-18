// import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import useGlobalStore from "@/store/global";

const BasicDialog: React.FC = () => {
  const { isDialogOpen, dialogData, toggleDialog } = useGlobalStore();

  return (
    <Dialog
      open={isDialogOpen}
      handler={toggleDialog}
      size="sm"
      className="duration-0"
      animate={
        {
          // mount: { scale: 1, y: 0 },
          // unmount: { scale: 0.9, y: -100 }
        }
      }
    >
      <DialogHeader>
        {dialogData.title}
        <XMarkIcon className="w-6 h-6 absolute right-4 cursor-pointer" onClick={toggleDialog}></XMarkIcon>
      </DialogHeader>
      <DialogBody
      // dangerouslySetInnerHTML={{ __html: dialogData.body }}
      >
        {dialogData.body}
      </DialogBody>
      <DialogFooter className="flex justify-center">
        {dialogData.buttons.map((button, index) => (
          <Button key={`dialog_button_${index}`} onClick={button.event} className="bg-primary mr-1 outline-none">
            <Typography variant="h6" className="text-black font-bold text-sm">
              {button.name}
            </Typography>
          </Button>
        ))}
      </DialogFooter>
    </Dialog>
  );
};

export default BasicDialog;
