import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return {
    toast: (options) => {
      if (options.variant === 'destructive') {
        sonnerToast.error(options.description);
      } else {
        sonnerToast.success(options.description);
      }
    }
  };
};
