import { create } from "zustand";

interface UsePostDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const usePostDialog = create<UsePostDialog>((set) => ({
  open: false,
  setOpen(value) {
    set({ open: value });
  },
}));
