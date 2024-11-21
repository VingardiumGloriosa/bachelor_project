import { defineStore } from "pinia";
import { toast as _toast } from "vuetify-sonner";

export enum ToastType {
  NONE,
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
  DELETE,
}

export const useToastStore = defineStore("ToastStore", {
  actions: {
    toast(message: string, type: ToastType = ToastType.NONE): void {
      switch (type) {
        case ToastType.NONE:
          _toast(message);
          break;
        case ToastType.SUCCESS:
          _toast.success(message);
          break;
        case ToastType.WARNING:
          _toast.warning(message);
          break;
        case ToastType.ERROR:
          _toast.error(message);
          break;
        case ToastType.INFO:
          _toast.info(message);
          break;
        case ToastType.DELETE:
          _toast.error(message, {
            prependIcon: "mdi-check",
          });
          break;
      }
    },
  },
});
