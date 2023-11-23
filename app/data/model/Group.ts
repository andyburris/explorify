import { HistoryEntry } from "./HistoryEntry";

export enum GroupType {
    None, Hour, Day, Month, Year
}
export class Group {
    public id: string = crypto.randomUUID()
    public totalPlays: number
    constructor(
        public type: GroupType,
        public date: Date,
        public combinations: Combination[],
    ){
        this.totalPlays = combinations.reduce((acc, c) => acc + c.listens.length, 0)
    }
}

export class TrackCombination implements Combination {
    public id: string = crypto.randomUUID()
    constructor(
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
        public artistName: string,
        public listens: HistoryEntry[],
    ) {}
}
export interface Combination {
    id: string,
    listens: HistoryEntry[],
}