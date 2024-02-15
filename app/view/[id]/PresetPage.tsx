"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { IconLogo } from "@/app/common/Logo"
import { LinkButton, StaticButton } from "@/app/common/button/Button"
import { getListens } from "@/app/data/persist/Database"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, CaretDoubleDown, DotsThreeVertical, FileDashed, FloppyDiskBack, Hash, Moon, MusicNotesPlus, PencilSimple, Play, Share, SquaresFour, Upload } from "phosphor-react-sc"
import React, { useEffect, useMemo, useState } from "react"
import { DataTable, DisplayOperation } from "./DataTable"
import { applyGroupOperation, applyNonGroupOperations, applyOperations } from "@/app/data/transform/Operating"
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
import Link from "next/link"
import { JumpTo } from "./JumpTo"
import { it } from "node:test"
import { Group } from "@/app/data/model/Group"
import { Combination } from "@/app/data/model/Combination"

export function PresetPage({ initialPreset, isShared, customizeInitial }: { initialPreset: Preset, isShared: boolean, customizeInitial?: boolean }) {
    const router = useRouter()
    
    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    // useEffect(() => { getListens().then(entries => { setLoadedEntries(entries.slice(0, 1000)) }) }, [])
    useEffect(() => { getListens().then(entries => { setLoadedEntries(entries) }) }, [])

    const [customizedPreset, setCustomizedPreset] = useState(initialPreset)
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

function EmptyData() {
    return (
        <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white shadow-outset">
            <div className="flex flex-col gap-4">
                <MusicNotesPlus weight="duotone" className="text-neutral-500 text-3xl"/>
                <div className="flex flex-col">
                    <p className="font-serif font-semibold text-3xl tracking-tight">You haven’t imported your listens yet</p>
                    <p className="text-neutral-500">To explore your listening history in Quantify, you need to request and download your extended listening history from Spotify. It takes ~2 weeks to receive your data.</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <a href="https://www.spotify.com/us/account/privacy/">
                    <EmptyDataButton icon={<FileDashed/>} title="Don’t have your listening history?" description={<p>Request it from Spotify here. Be sure to request your <strong>extended</strong> listening history.</p>}/>
                </a>
                <Link href="/import">
                    <EmptyDataButton icon={<Upload/>} title="Already have your listening history?" description={<p>Import your .zip file to Quantify!</p>}/>
                </Link>
            </div>
        </div>
    )
}
function EmptyDataButton({ icon, title, description }: { icon: React.ReactNode, title: string, description: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 cursor-pointer">
            <div className="flex-shrink-0">{icon}</div>
            <div className="text-green-900 flex-shrink w-full">
                <p className="font-serif font-semibold text-2xl tracking-tight">{title}</p>
                {description}
            </div>
            <ArrowRight className="flex-shrink-0" />
        </div>
    )
}