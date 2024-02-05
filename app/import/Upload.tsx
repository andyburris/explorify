"use client"

import { ArrowLeft, FileArchive, FileZip, Spinner, Upload, Warning } from "phosphor-react-sc"
import { Button, LinkButton } from "../common/button/Button"
import { Container } from "../common/Container"
import { Logo } from "../common/Logo"
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

export function UploadPage({ onUpload, hasExisting }: { onUpload: (entries: HistoryEntry[], rememberHistory: boolean) => void, hasExisting: boolean }) {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [isProcessing, setProcessing] = useState(false)
    const [isError, setError] = useState(false)
    return (
        <Container>
            <div className="flex flex-col gap-8">
                { hasExisting && 
                    <div className="w-full flex -ml-4 -mb-8">
                        <LinkButton linkPath="/" text="Home" icon={<ArrowLeft/>} hideShadow/>
                    </div>
                }
                <Header 
                    icon={<Logo/>} 
                    title="Quantize" 
                    description="Take a deep dive into your entire Spotify streaming history"
                />
                <div className="flex flex-col gap-3">
                    <p className="font-serif font-semibold text-2xl tracking-tight">How it works</p>
                    <div className="flex gap-3 flex-wrap justify-stretch items-stretch">
                        <InstructionCard stepNumber={1} link="https://www.spotify.com/us/account/privacy/">Request your <b>extended</b> streaming history from Spotify</InstructionCard>
                        <InstructionCard stepNumber={2}>Wait ~2 weeks to receive the .zip file</InstructionCard>
                        <InstructionCard stepNumber={3}>Import it below to start exploring your data!</InstructionCard>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="font-serif font-semibold text-2xl tracking-tight">Import</p>
                    <input type="file" id="file-import" className="hidden" onChange={(e) => setFile(e.target.files?.[0])}/>
                    <label htmlFor="file-import" className="flex flex-col gap-4 items-center justify-center px-8 py-12 border-dashed border border-neutral-200 rounded-xl cursor-pointer bg-neutral-50">
                        <FileArchive size="40px" className="text-neutral-500"/>
                        { file !== undefined ? <p>{file.name}</p> : <p>Drag and drop or click to import your .zip file</p>}
                    </label>
                    <p className="text-neutral-500">This file stays on your device, and is never uploaded to any servers.</p>
                </div>
                { isError &&
                    <div className="flex items-center gap-3 p-3 bg-red-50 border-red-300 text-red-700 rounded-xl">
                        <Warning className="flex-shrink-0"/>
                        <p>File wasn't able to be processed. Are you sure you have the right file (with the <b>extended</b> streaming history)?</p>
                    </div>
                }
                <ActionButton 
                text={ isProcessing ? "Processing" : "Process" }
                icon={isProcessing ? <Spinner>
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        dur="1s"
                        from="0 0 0"
                        to="360 0 0"
                        repeatCount="indefinite"
                    ></animateTransform>
                </Spinner> : <Upload/>} 
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
                                    onUpload(entries, false)
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

