import * as Dialog from "@radix-ui/react-dialog"
import { ActionButton } from "./button/ActionButton"
import { X } from "phosphor-react-sc"

export interface DialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
}
export interface CommonDialogProps extends DialogProps {
    title: string,
    widgets?: React.ReactNode,
    children: React.ReactNode,
}
export function CommonDialog({ title, open, onOpenChange, widgets, children }: CommonDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-hidden overflow-y-scroll">
                    <div className="flex flex-col gap-6 h-full">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-2 items-center w-full">
                                <div className="flex gap-x-4 gap-y-2 items-center flex-grow flex-wrap">
                                    <p className="font-serif font-bold tracking-tight text-4xl flex-grow">{title}</p>
                                    {widgets}
                                </div>
                                <ActionButton className="flex-shrink-0" onClick={() => onOpenChange(false)} icon={<X/>} />
                            </div>
                        </div>
                        {children}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}