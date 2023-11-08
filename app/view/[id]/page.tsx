"use client"

import { Container } from "@/app/common/Container"
import { Dropdown } from "@/app/common/Dropdown"
import { Header } from "@/app/common/Header"
import { Logo } from "@/app/common/Logo"
import { StaticButton } from "@/app/common/button/Button"
import { DATABASE_NAME, getListens } from "@/app/data/Database"
import { defaultPresets } from "@/app/data/Defaults"
import { HistoryEntry } from "@/app/data/model/HistoryEntry"
import { deleteDB } from "idb"
import { ArrowCounterClockwise, DotsThreeVertical } from "phosphor-react-sc"
import { useEffect, useState } from "react"
import { DataTable } from "./DataTable"
import { applyFilters } from "@/app/data/Filtering"
import { LazyList } from "./LazyList"

export default function ViewPage({ params }: { params: { id: string } }) {
    const preset = defaultPresets.find(p => p.id == params.id)

    const [loadedEntries, setLoadedEntries] = useState<HistoryEntry[] | undefined>();
    useEffect(() => { 
        getListens().then(entries => {
            const sorted = entries.toSorted((a, b) => a.timestamp.getTime() - b.timestamp.getTime() )
            setLoadedEntries(sorted)
        })
    }, [])

    const filtered = (loadedEntries === undefined || preset === undefined) ? undefined : applyFilters(loadedEntries, preset.filters);

    if(preset === undefined) return (<p>Can't find preset with id = "{params.id}"</p>)
    else return (
        <Container>
            <Header 
                icon={<Logo/>} 
                title={preset.name}
                description={preset.description}
                actions={
                    <div className="flex gap-3">
                        <div className="px-3 py-2 text-stone-500 border border-stone-300 rounded-full">
                            { loadedEntries === undefined
                                ? <p>Loading...</p>
                                : <p>{`${loadedEntries.length.toLocaleString()} play${loadedEntries.length == 0 ? "" : "s"}`}</p> }
                        </div>
                        <Dropdown
                            trigger={<StaticButton text={undefined} icon={<DotsThreeVertical size="24px"/>}/>}
                            menuItems={[
                                {
                                    icon: <ArrowCounterClockwise/>,
                                    title: "Upload new listens",
                                    onClick: () => { deleteDB(DATABASE_NAME) }
                                }
                            ]}
                        />
                    </div>
                }/>
            { filtered 
                ? <DataTable groups={filtered}/> 
                : <LazyList items={new Array(50)} itemContent={(i) => <div className="h-8 w-full rounded-full bg-stone-100 my-2"></div>}/>
            }
        </Container>
    )
}