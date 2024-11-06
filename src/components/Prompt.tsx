'use client';

import type { ModuleList } from '@/lib/schema/moduleList';

import { useAppDispatch } from '@/hooks/redux';
import { Button } from './ui/button';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

type PromptProps<T> = {
  description: string;
  promptKey: keyof ModuleList;
  title: string;
  trigger: string | React.ReactNode;
  handleConfirmation: () => T;
};
/** TODO: This is not working as intended. Redux's state is updating but the component remains the same. */
const Prompt = <T,>(props: PromptProps<T>) => {
  const dispatch = useAppDispatch();
  const [isConfirm, setIsConfirm] = useState(false);

  function handleCloseModal() {
    dispatch(
      inputControlSetPromptType({
        key: props.promptKey,
        promptType: 'no document',
      })
    );
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        // Guard clauses.
        if (open) return;

        dispatch(
          inputControlSetPromptType({
            key: props.promptKey,
            promptType: isConfirm ? 'submitted' : 'no document',
          })
        );
      }}
    >
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogHeader>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button
              className="bg-green-400"
              onClick={() => {
                setIsConfirm(true);
                props.handleConfirmation();
              }}
            >
              Confirm
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => handleCloseModal()}>
              Not yet
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Prompt;
