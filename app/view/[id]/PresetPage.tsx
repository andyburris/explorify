"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { IconLogo } from "@/app/common/Logo"
import { TextField } from "@/app/common/TextField"
import { ActionButton } from "@/app/common/button/ActionButton"
import { LinkButton, StaticButton } from "@/app/common/button/Button"
import { hashOperations } from "@/app/data/hashing/Hashing"
import { Combination } from "@/app/data/model/Combination"
import { Group } from "@/app/data/model/Group"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { Preset } from "@/app/data/model/Preset"
import { getListens } from "@/app/data/persist/Database"
import { savePreset } from "@/app/data/persist/PresetRepository"
import { applyGroupOperation, applyNonGroupOperations } from "@/app/data/transform/Operating"
import { DEBUG } from "@/app/data/utils/debug"
import { usePresets } from "@/app/data/utils/presetUtils"
import { useRouter } from "next/navigation"
import nightwindHelper from "nightwind/helper"
import { ArrowCounterClockwise, ArrowLeft, CaretDoubleDown, DotsThreeVertical, FloppyDiskBack, Hash, Moon, PencilSimple, Play, Share, SquaresFour } from "phosphor-react-sc"
import { useEffect, useMemo, useState } from "react"
import { LazyList } from "../../common/LazyList"
import { DataTable, DisplayOperation } from "./DataTable"
import { JumpTo } from "./JumpTo"
import { SaveDialog } from "./SaveDialog"
import { ShareDialog } from "./ShareDialog"
import { OperationType, OperationsSelector } from "./filters/OperationsSelector"
import { EmptyData } from "./item/EmptyData"

export function PresetPage({ initialPreset, isShared, customizeInitial }: { initialPreset: Preset, isShared: boolean, customizeInitial?: boolean }) {
    const router = useRouter()
    
    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    // useEffect(() => { getListens().then(entries => { setLoadedEntries(entries.slice(0, 1000)) }) }, [])
    useEffect(() => { getListens().then(entries => { setLoadedEntries(entries) }) }, [])

    const [customizedPreset, setCustomizedPreset] = useState(JSON.parse(JSON.stringify(initialPreset)))
    const grouped = useMemo(() => (loadedEntries === undefined) ? undefined : applyGroupOperation(loadedEntries, customizedPreset.operations.group), [loadedEntries, customizedPreset.operations.group]) 
    const filtered = useMemo(() => (grouped === undefined) ? undefined : applyNonGroupOperations([...grouped], customizedPreset.operations), [grouped, customizedPreset.operations]) 
    const overwriting = usePresets()?.find(p => p.id == customizedPreset.id)
    const hasChanged = JSON.stringify(initialPreset) != JSON.stringify(customizedPreset)
    const isValid = (customizedPreset.name.trim().length != 0 && customizedPreset.description.trim().length != 0 && customizedPreset.icon.trim().length != 0 && customizedPreset.id.trim().length != 0)
    const displayOperation: DisplayOperation = { viewOptions: customizedPreset.operations.viewOptions, infoOperation: customizedPreset.operations.info }

    const [isCustomizing, setCustomizing] = useState(customizeInitial ?? false)
    const [currentTab, setCurrentTab] = useState(OperationType.Info)
    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false)
    const [isShareDialogOpen, setShareDialogOpen] = useState(false)
    const [isJumpToOpen, setJumpToOpen] = useState(false)
    const [jumpToSearchTerm, setJumpToSearchTerm] = useState("")
    const [scrollToItem, setScrollToItem] = useState<Group | Combination | undefined>(undefined)

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
                                        setCustomizedPreset(JSON.parse(JSON.stringify(initialPreset)))
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
                                        title: filtered === undefined ? "Loading..." : `${filtered.length.toLocaleString()} group${filtered.length == 1 ? "" : "s"}`,
                                    },
                                    {
                                        icon: <Hash/>,
                                        title: `${hashOperations(customizedPreset.operations)}`,
                                        hide: !DEBUG,
                                    },
                                    {
                                        icon: <CaretDoubleDown/>,
                                        title: "Jump to",
                                        onClick: () => setJumpToOpen(true),
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
            { (filtered && isJumpToOpen) && 
                <JumpTo 
                    searchTerm={jumpToSearchTerm}
                    groups={filtered} 
                    displayOperation={displayOperation} 
                    onSearchTermChange={t => setJumpToSearchTerm(t)}
                    onJump={async (item) => { 
                        setScrollToItem(item) 
                        setTimeout(() => setScrollToItem(undefined), 100)
                        console.log(`set scrollToItem = ${scrollToItem}`)
                    }} 
                    onClose={() => {
                        setJumpToOpen(false)
                        setJumpToSearchTerm("")
                    }}
                /> 
            }
            
        </div>
    )

    return (
        <Container>
            { (loadedEntries === undefined || filtered === undefined)
                ? <LazyList header={<div className="mb-10">{header}</div>} items={new Array(50)} itemContent={(i) => <div className="h-8 w-full rounded-full bg-neutral-100 my-2"></div>}/>
            : loadedEntries.length <= 0
                ? <LazyList header={<div className="mb-10">{header}</div>} items={new Array(1)} itemContent={(i) => <EmptyData/>}/>
            : <DataTable groups={filtered} operations={customizedPreset.operations} header={header} scrollToItem={scrollToItem}/> 
            }
        </Container>
    )
}