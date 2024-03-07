"use client"

import { ArrowLeft, ArrowRight, FileArchive, FileDotted, FileZip, Info, Spinner, Upload, Warning } from "phosphor-react-sc"
import { Button, LinkButton } from "../common/button/Button"
import { Container } from "../common/Container"
import { IconLogo, IconLogoStatic, Logo } from "../common/Logo"
import { Switch } from "../common/Switch"
import { useState } from "react"
import { ActionButton } from "../common/button/ActionButton"
import { parseFile } from "../data/Parsing"
import { Header } from "../common/Header"
import { HistoryEntry } from "../data/model/HistoryEntry"
import { openDB } from "idb"
import { DATABASE_NAME, LISTENS_STORE_NAME, getDatabase, saveListens } from "../data/persist/Database"
import { InstructionCard } from "./InstructionCard"
import { getPresets, saveDefaultPresets } from "../data/persist/PresetRepository"
import { CalloutCard } from "../common/CalloutCard"
import Link from "next/link"
import { generateMockData } from "../data/mock/mock"

export function ImportPage({ onUpload }: { onUpload: (entries: HistoryEntry[]) => void }) {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [isProcessing, setProcessing] = useState(false)
    const [isError, setError] = useState(false)
    return (
        <Container>
            <div className="flex flex-col gap-8">
                <div className="w-full flex -ml-4 -mb-8">
                    <LinkButton linkPath="/" text="Home" icon={<ArrowLeft/>} hideShadow/>
                </div>
                <Header 
                    icon={<IconLogoStatic icon={<Upload weight="duotone"/>}/>} 
                    title="Import" 
                    description="Quantify runs on the .zip file of your extended streaming history you got from Spotify. Import it here and start exploring!"
                />
                <div className="flex flex-col gap-3">
                    <input type="file" id="file-import" className="hidden" onChange={(e) => setFile(e.target.files?.[0])}/>
                    <label htmlFor="file-import" className="flex flex-col gap-2 items-center justify-center text-center px-8 py-12 border-dashed border border-neutral-200 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100">
                        <FileArchive size="40px" className="text-neutral-500"/>
                        { file !== undefined ? <p>{file.name}</p> : <p>Click to import your .zip file</p>}
                    </label>
                    <p className="text-neutral-500">This file stays on your device, and is never uploaded to any servers.</p>
                </div>
                { isError &&
                    <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl">
                        <Warning className="flex-shrink-0"/>
                        <p>File wasn't able to be processed. Are you sure you have the right file (with the <b>extended</b> streaming history)?</p>
                    </div>
                }
                 <Link href="/instructions">
                    <CalloutCard
                        title="Don’t have your streaming history yet?"
                        text="To use Quantify, you need to export your streaming history from Spotify—we’ll walk you through it"
                        leftIcon={cn => <FileDotted className={cn}/>}
                        rightIcon={<ArrowRight/>}
                        />
                </Link>
                <ActionButton 
                text={ isProcessing ? "Mocking" : "Mock" }
                icon={isProcessing ? <Spinner className="animate-spin"/> : <Upload/>} 
                className="w-fit"
                enabled={!isProcessing && file !== undefined}
                onClick={() => {
                    if(file !== undefined && isProcessing == false) {
                        console.log("processing mocks")
                        setProcessing(true)
                        parseFile(file)
                            .then(entries => {
                                if(entries.length <= 0) throw Error("nothing loaded")
                                generateMockData(entries)
                                .then(entries => {
                                    if(entries.length <= 0) throw Error("nothing loaded")
                                    saveListens(entries).then(() => {
                                        if(getPresets().length <= 0) { 
                                            saveDefaultPresets()
                                        }
                                        onUpload(entries)
                                    })
                                })
                                .then(_ => setProcessing(false))
                            })
                            .catch(e => {
                                setError(true)
                                setProcessing(false)
                                console.log(e)
                            })
                    }
                }} />
                <ActionButton 
                text={ isProcessing ? "Processing" : "Process" }
                icon={isProcessing ? <Spinner className="animate-spin"/> : <Upload/>} 
                className="w-fit"
                enabled={!isProcessing && file !== undefined}
                onClick={() => {
                    if(file !== undefined && isProcessing == false) {
                        console.log("processing entries")
                        setProcessing(true)
                        parseFile(file)
                            .then(entries => {
                                if(entries.length <= 0) throw Error("nothing loaded")
                                saveListens(entries).then(() => {
                                    if(getPresets().length <= 0) { 
                                        saveDefaultPresets()
                                    }
                                    onUpload(entries)
                                })
                            })
                            .catch(e => {
                                setError(true)
                                setProcessing(false)
                                console.log(e)
                            })
                    }
                }} />
            </div>
        </Container>
    )
}

