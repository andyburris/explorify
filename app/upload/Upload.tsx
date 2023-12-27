"use client"

import { FileArchive, FileZip, Spinner, Upload } from "phosphor-react-sc"
import { Button } from "../common/button/Button"
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

export function UploadPage({ onUpload }: { onUpload: (entries: HistoryEntry[], rememberHistory: boolean) => void }) {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [isProcessing, setProcessing] = useState(false)

    return (
        <Container>
            <div className="flex flex-col gap-8">
                <Header 
                    icon={<Logo/>} 
                    title="Quantize" 
                    description="Take a deep dive into your entire Spotify streaming history"
                />
                <div className="flex flex-col gap-3">
                    <p className="font-serif font-semibold text-2xl">How it works</p>
                    <div className="flex gap-3 flex-wrap justify-stretch items-stretch">
                        <InstructionCard stepNumber={1} link="https://www.spotify.com/us/account/privacy/">Request your <b>extended</b> streaming history from Spotify</InstructionCard>
                        <InstructionCard stepNumber={2}>Wait ~2 weeks to receive the .zip file</InstructionCard>
                        <InstructionCard stepNumber={3}>Upload it below to start exploring your data!</InstructionCard>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="font-serif font-semibold text-2xl">Upload</p>
                    <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0])}/>
                    <label htmlFor="file-upload" className="flex flex-col gap-4 items-center justify-center px-8 py-12 border-dashed border border-neutral-200 rounded-xl cursor-pointer bg-neutral-50">
                        <FileArchive size="40px" className="text-neutral-500"/>
                        { file !== undefined ? <p>{file.name}</p> : <p>Drag and drop or click to upload your .zip file</p>}
                    </label>
                    <p className="text-neutral-500">This file stays on your device, and is never uploaded to any servers.</p>
                </div>
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
                enabled={!isProcessing}
                onClick={() => {
                    if(file !== undefined && isProcessing == false) {
                        console.log("processing entries")
                        setProcessing(true)
                        parseFile(file)
                            .then(entries => {
                                if(entries.length <= 0) throw Error("nothing loaded")
                                saveListens(entries).then(() => onUpload(entries, false))
                            })
                            .catch(e => {
                                setProcessing(false)
                                console.log(e)
                            })
                    }
                }} />
            </div>
        </Container>
    )
}

