import { ArrowCounterClockwise, Trash, Upload } from "phosphor-react-sc";
import { CommonDialog, DialogProps } from "../common/CommonDialog";
import { ActionButton } from "../common/button/ActionButton";
import { clearListens } from "../data/persist/Database";
import { resetPresets } from "../data/persist/PresetRepository";
import { useRouter } from "next/navigation";
import { LinkButton } from "../common/button/Button";
import { useState } from "react";

export function ManageData({ open, onOpenChange }: DialogProps) {
    const router = useRouter()

    const [deleteInProgress, setDeleteInProgress] = useState(false)
    return (
        <CommonDialog
            title="Manage data"
            open={open}
            onOpenChange={onOpenChange}
        >
            <DataSection
                title="Import new listens"
                description="If you've exported new data from Spotify, you can reimport a new .zip file"
                button={
                    <LinkButton 
                        icon={<Upload/>} 
                        text="Import" 
                        linkPath="/import"
                        />
                }
            />
            <DataSection
                title="Reset presets"
                description="Resets all presets to the website defaults. This will remove any custom presets you have, so be sure to copy their links beforehand to not lose them permanently!"
                button={
                    <ActionButton 
                        icon={<ArrowCounterClockwise/>} 
                        text="Reset" 
                        onClick={() => {
                            resetPresets()
                            router.refresh()
                        }}
                        />
                }
            />
            <DataSection
                title="Delete listening history"
                description="Clears your listening history. This does not delete the .zip file you originally imported. As always, your listening history is never uploaded to any servers."
                button={
                    <ActionButton 
                        icon={<Trash/>} 
                        text={deleteInProgress ? "Deleting..." : "Delete" }
                        enabled={!deleteInProgress}
                        onClick={async () => {
                            setDeleteInProgress(true)
                            clearListens().then(() => router.push("/"))
                        }}
                        />
                }
            />
        </CommonDialog>
    )
}

function DataSection({ title, description, button }: {title: string, description: string, button: React.ReactNode}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <p className="font-semibold">{title}</p>
                <p className="text-neutral-500">{description}</p>
            </div>
            {button}
        </div>
    )
}