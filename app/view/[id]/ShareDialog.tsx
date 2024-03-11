import { CommonDialog } from "@/app/common/CommonDialog";
import { Switch } from "@/app/common/Switch";
import { ActionButton } from "@/app/common/button/ActionButton";
import { hashOperations, hashPreset } from "@/app/data/hashing/Hashing";
import { Preset } from "@/app/data/model/Preset";
import * as Dialog from "@radix-ui/react-dialog"
import { NEXT_URL } from "next/dist/client/components/app-router-headers";
import { Copy, Info, Share, X } from "phosphor-react-sc";
import { title } from "process";
import { useState } from "react";

const SHARE_INCLUDE_DETAILS_KEY = "shareIncludeDetails"

export function ShareDialog({ preset, open, onOpenChange }: { preset: Preset, open: boolean, onOpenChange: (open: boolean) => void, }) {
    // const hash = hashOperations(customizedPreset.operations)
    const hostname = process.env.NODE_ENV == 'production' ? "https://explorify.link" : "https://localhost:3000"
    const domain =  `${hostname}/customize/`
    const [includeDetails, setIncludeDetails] = useState(Boolean(localStorage.getItem(SHARE_INCLUDE_DETAILS_KEY) ?? true))
    const [includeSearchTerm, setIncludeSearchTerm] = useState(false)

    const presetHash = hashPreset(preset, includeSearchTerm)
    const operationHash = hashOperations(preset.operations)

    const hash = (includeDetails ? presetHash : operationHash)
    const url = `${domain}${hash}`

    const [copied, setCopied] = useState(false)

    return (
        <CommonDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Share View"
        >
            <div className="flex p-4 gap-4 rounded-2xl bg-green-50 border border-green-200">
                {/* <p className="text-green-700">Link</p> */}
                <p className="">
                    <span className="text-green-700">{domain}</span>
                    <span className="text-green-900 font-semibold break-all">{hash}</span>
                </p>
                {/* <ActionButton hideShadow onClick={() => setIncludeDetails(!includeDetails)} icon={<Info/>} /> */}
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
            <div className="flex flex-col gap-4">
                <p className="font-serif font-semibold text-2xl tracking-tight">Options</p>
                <ToggleSection
                    title="Don't include details"
                    description="Drop details like the view title and description from the URL, only keeping the actual filters. Makes the URL shorter (and more mysterious) for whoever you're sending it to."
                    checked={!includeDetails}
                    onCheckedChange={(updated) => {
                        setIncludeDetails(!updated)
                        localStorage.setItem(SHARE_INCLUDE_DETAILS_KEY, String(!updated))
                    }}/>
                { preset.operations.filter.searchTerm.trim().length > 0 &&
                    <ToggleSection
                        title="Include current search term"
                        description="If on, the person who opens the link will have the same term prefilled in their search bar"
                        checked={includeSearchTerm}
                        onCheckedChange={setIncludeSearchTerm}/>
                }
            </div>
        </CommonDialog>
    )
}

function ToggleSection({title, description, checked, onCheckedChange}: { title: string, description: string, checked: boolean, onCheckedChange: (updated: boolean) => void}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex flex-col flex-grow">
                <p className="font-semibold">{title}</p>
                <p className="text-neutral-500">{description}</p>
            </div>
            <div className="flex-shrink-0">
                <Switch checked={checked} onCheckedChange={onCheckedChange} />
            </div>
        </div>
    )
}