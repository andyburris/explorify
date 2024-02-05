import { CommonDialog } from "@/app/common/CommonDialog";
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
        <CommonDialog 
            title="Save Preset" 
            open={open}
            onOpenChange={onOpenChange}
            widgets={<ActionButton enabled={isValid} onClick={() => onSave(preset)} text="Save" icon={<FloppyDiskBack/>} />}>
            { overwriting &&
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 w-full text-green-700 border border-green-200">
                    <Warning/>
                    <p className="">Saving will overwrite <span className="font-bold text-green-900">{overwriting.name}</span></p>
                </div>
            }
            <PresetPreview preset={preset} listens={listens}/>
        </CommonDialog>
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