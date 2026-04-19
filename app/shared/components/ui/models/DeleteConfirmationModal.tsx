import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
// import DeleteIcon from "../../icons/delete";
import ModalHeader from "./ModalHeader";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    itemName?: string;
    isDeleting?: boolean;
}

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete",
    itemName = "this item",
    isDeleting = false,
}: DeleteConfirmationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm xs:max-w-md rounded-2xl p-0 gap-0 overflow-hidden [&>button]:hidden bg-surface">

                {/* Reuse existing ModalHeader — same as all other modals */}
                <ModalHeader title={title} onClose={onClose} />

                {/* Content */}
                <DialogDescription asChild>
                    <div className="px-6 py-5 flex items-start gap-4">
                        <div>
                            <p className="surface-text text-base">
                                {message}{" "}
                                <span className="font-semibold surface-text">{itemName}</span>?
                            </p>
                            <p className="surface-text text-sm mt-1">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </DialogDescription>

                {/* Footer */}
                <DialogFooter className="flex flex-row items-center justify-end gap-3 px-6 py-4 border-t border-surface">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationModal;