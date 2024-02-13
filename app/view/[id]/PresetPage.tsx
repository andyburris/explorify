"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { IconLogo } from "@/app/common/Logo"
import { LinkButton, StaticButton } from "@/app/common/button/Button"
import { getListens } from "@/app/data/persist/Database"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { ArrowCounterClockwise, ArrowLeft, DotsThreeVertical, FloppyDiskBack, Link, Moon, PencilSimple, Play, Share, SquaresFour } from "phosphor-react-sc"
import { useEffect, useMemo, useState } from "react"
import { DataTable } from "./DataTable"
import { applyOperations } from "@/app/data/transform/Operating"
import { LazyList } from "../../common/LazyList"
import { OperationType, OperationsSelector } from "./filters/OperationsSelector"
import { ActionButton } from "@/app/common/button/ActionButton"
import nightwindHelper from "nightwind/helper"
import { TextField } from "@/app/common/TextField"
import { hashOperations } from "@/app/data/hashing/Hashing"
import { SaveDialog } from "./SaveDialog"
import { Preset } from "@/app/data/model/Preset"
import { getPresets, savePreset } from "@/app/data/persist/PresetRepository"
import { useRouter } from "next/navigation"
import { usePresets } from "@/app/data/utils/presetUtils"
import { ShareDialog } from "./ShareDialog"
import { DEBUG } from "@/app/data/utils/debug"

export function PresetPage({ initialPreset, isShared }: { initialPreset: Preset, isShared: boolean }) {
    const router = useRouter()
    
    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    // useEffect(() => { getListens().then(entries => { setLoadedEntries(entries.slice(0, 1000)) }) }, [])
    useEffect(() => { getListens().then(entries => { setLoadedEntries(entries) }) }, [])

    const [customizedPreset, setCustomizedPreset] = useState(initialPreset)
    const filtered = useMemo(() => (loadedEntries === undefined) ? undefined : applyOperations(loadedEntries, customizedPreset.operations), [loadedEntries, customizedPreset.operations]) 
    const overwriting = usePresets()?.find(p => p.id == customizedPreset.id)
    const hasChanged = JSON.stringify(initialPreset) != JSON.stringify(customizedPreset)
    const isValid = (customizedPreset.name.trim().length != 0 && customizedPreset.description.trim().length != 0 && customizedPreset.icon.trim().length != 0 && customizedPreset.id.trim().length != 0)

    const [isCustomizing, setCustomizing] = useState(false)
    const [currentTab, setCurrentTab] = useState(OperationType.Info)
    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false)
    const [isShareDialogOpen, setShareDialogOpen] = useState(false)

    const header = (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <div className="w-full flex -ml-4">
                    <LinkButton linkPath="/" text="Home" icon={<ArrowLeft/>} hideShadow/>
                </div>
                <Header 
                    icon={<IconLogo iconName={customizedPreset.icon}/>} 
                    title={customizedPreset.name}
                    description={customizedPreset.description}
                    actions={
                        <div className="flex gap-3 items-center flex-wrap">
                            <ActionButton 
                                onClick={() => { 
                                    if(isCustomizing) {
                                        setCustomizedPreset(initialPreset)
                                        setCustomizing(false)
                                    } else { setCustomizing(true) }
                                }}
                                text={isCustomizing ? "Reset" : "Customize"} 
                                icon={isCustomizing ? <ArrowCounterClockwise/> : <PencilSimple/>}
                            />

                            { (hasChanged) && 
                                <ActionButton 
                                    onClick={() => setSaveDialogOpen(true)}
                                    text={overwriting ? `Overwrite` : `Save`} 
                                    icon={<FloppyDiskBack/>}
                                    enabled={isValid}
                                />
                            }

                            { (loadedEntries != undefined && isSaveDialogOpen) &&
                                <SaveDialog
                                open={isSaveDialogOpen}
                                onOpenChange={(open) => { setSaveDialogOpen(open) }}
                                onSave={p => { savePreset(p); setSaveDialogOpen(false); router.push(`/view/${p.id}`) }}
                                preset={customizedPreset}
                                listens={loadedEntries} />
                            }

                            { isShareDialogOpen &&
                                <ShareDialog
                                open={isShareDialogOpen}
                                onOpenChange={(open) => { setShareDialogOpen(open) }}
                                preset={customizedPreset} />
                            }

                            {/* <p className="text-neutral-500 tabular-nums">{hashOperations(customizedFilters)} • {hashOperations(customizedFilters, true)}</p> */}

                            <Dropdown
                                trigger={<StaticButton text={undefined} icon={<DotsThreeVertical/>}/>}
                                menuItems={[
                                    {
                                        icon: <Play/>,
                                        title: loadedEntries === undefined ? "Loading..." : `${loadedEntries.length.toLocaleString()} play${loadedEntries.length == 0 ? "" : "s"}`,
                                    },
                                    {
                                        icon: <SquaresFour/>,
                                        title: filtered === undefined ? "Loading..." : `${filtered.length.toLocaleString()} group${filtered.length == 0 ? "" : "s"}`,
                                    },
                                    {
                                        icon: <Link/>,
                                        title: `${hashOperations(customizedPreset.operations)}`,
                                        hide: !DEBUG,
                                    },
                                    {
                                        icon: <Share/>,
                                        title: "Share preset",
                                        onClick: () => setShareDialogOpen(true),
                                    },
                                    {
                                        icon: <Moon size="24px"/>,
                                        title: "Toggle dark mode",
                                        onClick: () => nightwindHelper.toggle()
                                    },
                                ]}
                            />
                        </div>
                    }
                />
            </div>
            { (isShared && !isCustomizing) && 
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 w-full text-green-700 border border-green-200">
                    <Share/>
                    <p className="">
                        You probably got this link from someone. <span className="font-semibold text-green-900 hover:underline cursor-pointer" onClick={() => setCustomizing(true)}>Customize</span> to make this preset your own and save it!</p>
                </div>
            }
            { isCustomizing &&
                <OperationsSelector 
                    currentPreset={customizedPreset} 
                    onChangePreset={p => setCustomizedPreset(p)}
                    currentTab={currentTab}
                    onChangeTab={setCurrentTab}
                     />
            }
            { customizedPreset.operations.viewOptions.showSearch && 
                <TextField 
                    currentValue={customizedPreset.operations.filter.searchTerm} 
                    placeholder="Search..."
                    onChangeValue={v => setCustomizedPreset({ ...customizedPreset, operations: { ...customizedPreset.operations, filter: { ...customizedPreset.operations.filter, searchTerm: v }}})} />
            }
        </div>
    )

    return (
        <Container>
            { filtered 
                ? <DataTable groups={filtered} viewOptions={customizedPreset.operations.viewOptions} infoOperation={customizedPreset.operations.info} header={header}/> 
            : (loadedEntries === undefined)
                ? <LazyList header={<div className="mb-10">{header}</div>} items={new Array(50)} itemContent={(i) => <div className="h-8 w-full rounded-full bg-neutral-100 my-2"></div>}/>
                : <LazyList header={<div className="mb-10">{header}</div>} items={new Array(1)} itemContent={(i) => <EmptyData/>}/>
            }
        </Container>
    )
}

function EmptyData() {
    return (
        <div className="p-4 rounded-2xl bg-neutral-50">
            
        </div>
    )
}