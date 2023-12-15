import { HistoryEntry } from "./HistoryEntry"

export class TrackCombination implements Combination {
    public id: string = crypto.randomUUID()
    constructor(
        public index: number,
        public trackName: string,
        public artistName: string,
        public albumName: string,
        public trackURI: string,
        public listens: HistoryEntry[],
    ) {}
}
export class ArtistCombination implements Combination {
    public id: string = crypto.randomUUID()
    constructor(
        public index: number,
        public artistName: string,
        public listens: HistoryEntry[],
    ) {}
}
export interface Combination {
    id: string,
    index: number,
    listens: HistoryEntry[],
}