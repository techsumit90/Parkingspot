import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function NotificationModal({
  isOpen,
  title,
  message,
  type,
  onClose,
}: NotificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-3">
          <p className="text-gray-600">{message}</p>
        </div>
        <DialogFooter>
          <Button 
            onClick={onClose}
            className={type === "success" ? "bg-primary hover:bg-primary/90" : "bg-red-500 hover:bg-red-600"}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
