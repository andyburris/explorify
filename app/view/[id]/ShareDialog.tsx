import { ActionButton } from "@/app/common/button/ActionButton";
import { hashOperations, hashPreset } from "@/app/data/hashing/Hashing";
import { Preset } from "@/app/data/model/Preset";
import * as Dialog from "@radix-ui/react-dialog"
import { Copy, Share, X } from "phosphor-react-sc";
import { useState } from "react";

export function ShareDialog({ preset, open, onOpenChange }: { preset: Preset, open: boolean, onOpenChange: (open: boolean) => void, }) {
    // const hash = hashOperations(customizedPreset.operations)
    const domain = "https://localhost:3000/customize/"
    const presetHash = hashPreset(preset)
    const operationHash = hashOperations(preset.operations)
    
    const [includeDetails, setIncludeDetails] = useState(Boolean(localStorage.getItem("shareIncludeDetails")))
    const hash = (includeDetails ? presetHash : operationHash)
    const url = `${domain}${hash}`

    const [copied, setCopied] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-hidden overflow-y-scroll">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-2 items-center w-full">
                                <div className="flex gap-x-4 gap-y-2 items-center flex-grow flex-wrap">
                                    <p className="font-serif font-bold tracking-tight text-4xl flex-grow">Share Preset</p>
                                </div>
                                <ActionButton className="shadow-none hover:bg-neutral-100 flex-shrink-0" onClick={() => onOpenChange(false)} icon={<X/>} />
                            </div>
                        </div>
                        <div className="flex flex-col p-4 gap-4 rounded-2xl bg-green-50 border border-green-200">
                            {/* <p className="text-green-700">Link</p> */}
                            <p className="">
                                <span className="text-green-700">{domain}</span>
                                <span className="text-green-950 font-semibold break-all">{hash}</span>
                            </p>
                        </div>
                        <ActionButton 
                            icon={<Copy/>} 
                            text={copied ? "Copied!" : "Copy link"}
                            onClick={() => {
                                navigator.clipboard.writeText(url)
                                if(!copied) {
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 1000)    
                                }
                            }}
                        />
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}