import { pickableIcons } from "@/app/common/PickedIcon";
import { TextField } from "@/app/common/TextField";
import { ActionButton } from "@/app/common/button/ActionButton";
import { Button } from "@/app/common/button/Button";
import { Combobox } from "@/app/common/components/ui/combobox";
import { HistoryEntry } from "@/app/data/model/HistoryEntry";
import { Preset } from "@/app/data/model/Preset";
import { getPresets } from "@/app/data/persist/PresetRepository";
import { PresetPreview } from "@/app/home/PresetPreview";
import * as Dialog from "@radix-ui/react-dialog"
import { FloppyDiskBack, Warning, X } from "phosphor-react-sc";
import { useMemo, useState } from "react";

export function SaveDialog({ open, preset, listens, onOpenChange, onSave }: {open: boolean, preset: Preset, listens: HistoryEntry[], onOpenChange: (open: boolean) => void, onSave: (preset: Preset) => void}) {
    const isValid = (preset.name.trim().length != 0 && preset.description.trim().length != 0 && preset.icon.trim().length != 0 && preset.id.trim().length != 0)
    const savedPresets = useMemo(() => getPresets(), [])
    const overwriting = savedPresets.find(p => p.id == preset.id)
    return (
        <Dialog.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-black opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[720px] translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-hidden overflow-y-scroll">
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex gap-2 items-center w-full">
                                <div className="flex gap-4 items-center flex-grow flex-wrap">
                                    <p className="font-serif font-bold tracking-tight text-4xl flex-grow">Save Preset</p>
                                    <ActionButton enabled={isValid} onClick={() => onSave(preset)} text="Save" icon={<FloppyDiskBack/>} />
                                </div>
                                <ActionButton className="shadow-none hover:bg-neutral-100" onClick={() => onOpenChange(false)} icon={<X/>} />
                            </div>
                            { overwriting &&
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 w-full text-green-700">
                                    <Warning/>
                                    <p className="">Saving will overwrite <span className="font-bold text-green-900">{overwriting.name}</span></p>
                                </div>
                            }
                            <div className="flex flex-col gap-4">
                            </div>
                        </div>
                        <PresetPreview preset={preset} listens={listens}/>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function ConfigItem({ name, children }: { name: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="font-semibold text-neutral-500">{name}</p>
            {children}
        </div>
    )
}