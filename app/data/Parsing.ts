import { unzip, setOptions } from "unzipit";
import { HistoryEntry, RawHistoryEntry, rawToHistoryEntry } from "./model/HistoryEntry";

// setOptions({workerURL: 'path/to/unzipit-worker.module.js'});

export async function parseFile(file: File): Promise<HistoryEntry[]> {
    const {entries} = await unzip(file);
    const relevantFiles = Object.entries(entries).filter(([filename, entry]) => filename.endsWith(".json") && filename.includes("Audio")) 

    const textDecoder = new TextDecoder()
    const filePromises: Array<Promise<Array<HistoryEntry>>> = relevantFiles.map(([filename, entry]) => {
        return entry
            .arrayBuffer()
            .then(buffer => new Uint8Array(buffer))
            .then(array => textDecoder.decode(array))
            .then(s => JSON.parse(s) as Array<RawHistoryEntry>)
            .then(rawList => rawList
                .map((raw) => rawToHistoryEntry(raw))
                .filter(e => e !== undefined)
                .map(e => e!)
            );
    })
    const allEntries: Array<HistoryEntry> = (await Promise.all(filePromises)).flat()
    return allEntries
}