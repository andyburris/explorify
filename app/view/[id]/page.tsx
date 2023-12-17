"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { IconLogo } from "@/app/common/Logo"
import { LinkButton, StaticButton } from "@/app/common/button/Button"
import { getListens } from "@/app/data/Database"
import { defaultPresets } from "@/app/data/Defaults"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { ArrowCounterClockwise, ArrowLeft, DotsThreeVertical, Link, Moon, Pencil, PencilSimple, Play, Share, SquaresFour } from "phosphor-react-sc"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"
import { applyOperations } from "@/app/data/transform/Operating"
import { LazyList } from "../../common/LazyList"
import { OperationsSelector } from "./filters/OperationsSelector"
import { ActionButton } from "@/app/common/button/ActionButton"
import nightwindHelper from "nightwind/helper"
import { TextField } from "@/app/common/TextField"
import { hashOperations, parseHash } from "@/app/data/hashing/Hashing"

export default function ViewPage({ params }: { params: { id: string } }) {
    const preset = defaultPresets.find(p => p.id == params.id)
    if(preset === undefined) return (<p>Can't find preset with id = "{params.id}"</p>)

    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    useEffect(() => { getListens().then(entries => { setLoadedEntries(entries) }) }, [])

    const [isCustomizing, setCustomizing] = useState(false)
    // const [customizedFilters, setCustomizedFilters] = useState(preset.operations)
    const [customizedFilters, setCustomizedFilters] = useState(parseHash(hashOperations(preset.operations)))

    const filtered = (loadedEntries === undefined || preset === undefined) ? undefined : applyOperations(loadedEntries, customizedFilters);

    return (
        <Container>
            <div className="flex flex-col">
                <div className="w-full flex -ml-4">
                    <LinkButton linkPath="/" text="Home" icon={<ArrowLeft/>} hideShadow/>
                </div>
                <Header 
                    icon={<IconLogo iconName={preset.icon}/>} 
                    title={preset.name}
                    description={preset.description}
                    actions={
                        <div className="flex gap-3 items-center">
                            <ActionButton 
                                onClick={() => { 
                                    if(isCustomizing) {
                                        setCustomizedFilters(preset.operations)
                                        setCustomizing(false)
                                    } else { setCustomizing(true) }
                                }}
                                text={isCustomizing ? "Reset" : "Customize"} 
                                icon={isCustomizing ? <ArrowCounterClockwise/> : <PencilSimple/>}
                            />

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
                                        title: `${hashOperations(customizedFilters)}`,
                                    },
                                    {
                                        icon: <Share/>,
                                        title: "Share preset",
                                        onClick: () => { 
                                            const hash = hashOperations(customizedFilters)
                                            const url = `https://localhost:3000/customize/${hash}`
                                            navigator.clipboard.writeText(url)
                                        },
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
            { isCustomizing &&
                <OperationsSelector currentOperations={customizedFilters} onChangeOperations={newFilters => setCustomizedFilters(newFilters)} />
            }
            { customizedFilters.viewOptions.showSearch && 
                <TextField 
                    currentValue={customizedFilters.filter.searchTerm} 
                    placeholder="Search..."
                    onChangeValue={v => setCustomizedFilters({ ...customizedFilters, filter: { ...customizedFilters.filter, searchTerm: v }})} />
            }
            { filtered 
                ? <DataTable groups={filtered} viewOptions={customizedFilters.viewOptions}/> 
                : <LazyList className="mt-10" items={new Array(50)} itemContent={(i) => <div className="h-8 w-full rounded-full bg-neutral-100 my-2"></div>}/>
            }
        </Container>
    )
}