import { HistoryEntry } from "./HistoryEntry"

export class TrackCombination implements Combination {
    public id: string = crypto.randomUUID()
    public totalPlaytimeMs: number = -1
    constructor(
        public index: number,
        public trackName: string,
        public artistName: string,
        public albumName: string,
        public trackURI: string,
        public listens: HistoryEntry[],
    ) {
        this.totalPlaytimeMs = listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }
}
export class ArtistCombination implements Combination {
    public id: string = crypto.randomUUID()
    public totalPlaytimeMs: number = -1
    constructor(
        public index: number,
        public artistName: string,
        public listens: HistoryEntry[],
    ) {
        this.totalPlaytimeMs = listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }
}
export interface Combination {
    id: string,
    index: number,
    listens: HistoryEntry[],
    totalPlaytimeMs: number,
}