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
import { DATABASE_NAME, LISTENS_STORE_NAME, getDatabase, saveListens } from "../data/Database"

export function UploadPage({ onUpload }: { onUpload: (entries: HistoryEntry[], rememberHistory: boolean) => void }) {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [isProcessing, setProcessing] = useState(false)

    return (
        <Container>
            <div className="flex flex-col gap-6">
                <Header icon={<Logo/>} title="Spotify Data Explorer" description="by Lyrical"/>
                <p>Don’t have your extended data yet? Go to <a href="https://www.spotify.com/us/account/privacy/" target="_blank">https://www.spotify.com/us/account/privacy/</a> and request your extended streaming history. It usually takes ~2 weeks to receive your data.</p>
            </div>
            <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files?.[0])}/>
            <label htmlFor="file-upload" className="flex flex-col gap-4 items-center justify-center px-8 py-12 border-dashed border border-stone-300 rounded-xl cursor-pointer">
                <FileArchive size="40px" className="text-stone-500"/>
                { file !== undefined ? <p>{file.name}</p> : <p>Drag and drop or click to upload your .zip file</p>}
            </label>
            <p className="text-stone-500">This file stays on your device, and is never uploaded to any servers.</p>
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
                onClick={() => {
                    if(file !== undefined) {
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
        </Container>
    )
}

