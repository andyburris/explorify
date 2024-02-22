import { AirplaneLanding, ArrowBendUpLeft, ArrowCounterClockwise, DotsThreeVertical, ListPlus, Moon, Pencil, Trash, TrashSimple, Upload } from "phosphor-react-sc";
import { Container } from "../common/Container";
import { Header } from "../common/Header";
import { Logo } from "../common/Logo";
import { ActionButton } from "../common/button/ActionButton";
import { Button, StaticButton } from "../common/button/Button";
import { HistoryEntry } from "../data/model/HistoryEntry";
import { Dropdown } from "../common/Dropdown";
import { defaultPresets } from "../data/Defaults";
import { PresetPreview } from "./PresetPreview";
import nightwind from "nightwind/helper"
import Link from "next/link";
import { Preset } from "../data/model/Preset";
import { clearPresets, deletePreset, resetPresets, savePreset } from "../data/persist/PresetRepository";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ManageData } from "./ManageData";
import { DEBUG } from "../data/utils/debug";
import { EditPresets } from "./EditPresets";

export function HomePage({ listens, presets }: { listens: HistoryEntry[], presets: Preset[] }) {
    const router = useRouter()
    
    const [orderedPresets, setOrderedPresets] = useState(presets)
    const [manageDataOpen, setManageDataOpen] = useState(false)
    const [editPresetsOpen, setEditPresetsOpen] = useState(false)
    return (
        <Container>
            <Header
                icon={<Logo/>}
                title="Quantify"
                // description="by Lyrical"
                actions={
                    <div className="flex gap-3 flex-wrap">
                        <div className="px-3 py-2 text-neutral-500 border border-neutral-200 rounded-full">
                            <p>{`${listens.length.toLocaleString()} play${listens.length == 0 ? "" : "s"}`}</p>
                        </div>
                        <Dropdown
                            trigger={<StaticButton icon={<DotsThreeVertical size="24px"/>}/>}
                            menuItems={[
                                {
                                    icon: <Pencil size="24px"/>,
                                    title: "Edit views",
                                    onClick: () => { setEditPresetsOpen(true) },
                                },
                                {
                                    icon: <Upload size="24px"/>,
                                    title: "Manage data",
                                    onClick: () => { setManageDataOpen(true) }
                                },
                                {
                                    icon: <Moon size="24px"/>,
                                    title: "Toggle dark mode",
                                    onClick: () => nightwind.toggle()
                                },
                            ]}
                        />
                    </div>
                }
            />
            <EditPresets 
                presets={orderedPresets} 
                onDeletePreset={preset => {
                    const newPresets = orderedPresets.filter(p => p.id != preset.id)
                    setOrderedPresets(newPresets)
                    deletePreset(preset)
                    newPresets.forEach((p, i) => savePreset(p, i))
                }}
                onPresetOrderChange={ps => {
                    ps.forEach((p, i) => savePreset(p, i))
                    setOrderedPresets(ps)
                }}
                onResetPresets={() => {
                    resetPresets()
                    router.refresh()
                }}
                open={editPresetsOpen} 
                onOpenChange={setEditPresetsOpen}
                />
            <ManageData open={manageDataOpen} onOpenChange={setManageDataOpen}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
                {orderedPresets.map((preset) => <PresetPreview key={preset.name} preset={preset} listens={listens} />)}
                <Link 
                    className="flex flex-col p-6 gap-2 min-h-[256px] justify-center items-center bg-neutral-50 dark:bg-neutral-100 border border-neutral-200 text-neutral-500 rounded-2xl" 
                    href="/customize"
                    scroll={true}
                >
                    <ListPlus size="32px"/>
                    <p>Add custom</p>
                </Link>
            </div>
        </Container>
    )
}