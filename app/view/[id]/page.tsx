"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { Logo } from "@/app/common/Logo"
import { LinkButton, StaticButton } from "@/app/common/button/Button"
import { DATABASE_NAME, getListens } from "@/app/data/Database"
import { defaultPresets } from "@/app/data/Defaults"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { deleteDB } from "idb"
import { ArrowCounterClockwise, ArrowLeft, DotsThreeVertical, Pencil, PencilSimple, Play, Share } from "phosphor-react-sc"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"
import { applyFilters } from "@/app/data/Filtering"
import { LazyList } from "./LazyList"
import { FilterSelector } from "./filters/FilterSelector"
import { ActionButton } from "@/app/common/button/ActionButton"

export default function ViewPage({ params }: { params: { id: string } }) {
    const preset = defaultPresets.find(p => p.id == params.id)
    if(preset === undefined) return (<p>Can't find preset with id = "{params.id}"</p>)

    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    useEffect(() => { getListens().then(entries => { setLoadedEntries(entries) }) }, [])

    const [isCustomizing, setCustomizing] = useState(false)
    const [customizedFilters, setCustomizedFilters] = useState(preset.filters)

    const filtered = (loadedEntries === undefined || preset === undefined) ? undefined : applyFilters(loadedEntries, customizedFilters);

    return (
        <Container>
            <div className="w-full flex -ml-4">
                <LinkButton linkPath="/" className="hover:bg-neutral-100" text="Home" icon={<ArrowLeft/>} hideShadow/>
            </div>
            <Header 
                icon={<Logo/>} 
                title={preset.name}
                description={preset.description}
                actions={
                    <div className="flex gap-3">
                        <ActionButton 
                            onClick={() => { 
                                if(isCustomizing) {
                                    setCustomizedFilters(preset.filters)
                                    setCustomizing(false)
                                } else { setCustomizing(true) }
                            }}
                            text={isCustomizing ? "Reset" : "Customize"} 
                            icon={isCustomizing ? <ArrowCounterClockwise/> : <PencilSimple/>}
                        />

                        <Dropdown
                            trigger={<StaticButton text={undefined} icon={<DotsThreeVertical size="24px"/>}/>}
                            menuItems={[
                                {
                                    icon: <Play/>,
                                    title: loadedEntries === undefined ? "Loading..." : `${loadedEntries.length.toLocaleString()} play${loadedEntries.length == 0 ? "" : "s"}`,
                                },
                                {
                                    icon: <Share/>,
                                    title: "Share preset",
                                    onClick: () => {  },
                                },
                            ]}
                        />
                    </div>
                }/>
            { isCustomizing &&
                <FilterSelector currentFilters={customizedFilters} onChangeFilters={newFilters => setCustomizedFilters(newFilters)} />
            }
            { filtered 
                ? <DataTable groups={filtered}/> 
                : <LazyList className="mt-10" items={new Array(50)} itemContent={(i) => <div className="h-8 w-full rounded-full bg-neutral-100 my-2"></div>}/>
            }
        </Container>
    )
}