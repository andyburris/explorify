import { HistoryEntry } from "./HistoryEntry"
import { Listen } from "./Listen"
import { ViewInfoType, ViewInfoTypePercent } from "./ViewOptions"


export class TrackCombination implements Combination {
    public id: string = crypto.randomUUID()
    
    public plays: number = -1
    public playtime: number = -1
    public visiblePlays: number = -1
    public visiblePlaytime: number = -1
    
    public totalPlayPercent: number = -1
    public totalPlaytimePercent: number = -1
    public groupPlayPercent: number = -1
    public groupPlaytimePercent: number = -1

    constructor(
        public index: number,
        public trackName: string,
        public artistName: string,
        public albumName: string,
        public trackURI: string,
        public listens: Listen[],
    ) {
        this.plays = this.listens.length
        this.playtime = this.listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }

    recalculateTotals(totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) {
        this.visiblePlays = this.listens.filter(l => !l.hidden).length
        this.visiblePlaytime = this.listens.filter(l => !l.hidden).reduce((acc, l) => acc + l.millisecondsPlayed, 0)

        this.totalPlayPercent = this.visiblePlays / totalPlays
        this.totalPlaytimePercent = this.visiblePlaytime / totalPlaytime
        this.groupPlayPercent = this.visiblePlays / groupPlays
        this.groupPlaytimePercent = this.visiblePlaytime / groupPlaytime
    }

    percent(primaryInfo: ViewInfoTypePercent): number {
        switch(primaryInfo) {
            case ViewInfoType.PercentTotalPlays: return this.totalPlayPercent
            case ViewInfoType.PercentTotalPlaytime: return this.totalPlaytimePercent
            case ViewInfoType.PercentGroupPlays: return this.groupPlayPercent
            case ViewInfoType.PercentGroupPlaytime: return this.groupPlaytimePercent
            default: return -1
        }
    }
}
export class ArtistCombination implements Combination {
    public id: string = crypto.randomUUID()

    public plays: number = -1
    public playtime: number = -1
    public visiblePlays: number = -1
    public visiblePlaytime: number = -1

    public totalPlayPercent: number = -1
    public totalPlaytimePercent: number = -1
    public groupPlayPercent: number = -1
    public groupPlaytimePercent: number = -1

    constructor(
        public index: number,
        public artistName: string,
        public listens: Listen[],
    ) {
        this.plays = this.listens.length
        this.playtime = this.listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }

    recalculateTotals(totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) {
        this.visiblePlays = this.listens.filter(l => !l.hidden).length
        this.visiblePlaytime = this.listens.filter(l => !l.hidden).reduce((acc, l) => acc + l.millisecondsPlayed, 0)

        this.totalPlayPercent = this.visiblePlays / totalPlays
        this.totalPlaytimePercent = this.visiblePlaytime / totalPlaytime
        this.groupPlayPercent = this.visiblePlays / groupPlays
        this.groupPlaytimePercent = this.visiblePlaytime / groupPlaytime
    }

    percent(primaryInfo: ViewInfoTypePercent): number {
        switch(primaryInfo) {
            case ViewInfoType.PercentTotalPlays: return this.totalPlayPercent
            case ViewInfoType.PercentTotalPlaytime: return this.totalPlaytimePercent
            case ViewInfoType.PercentGroupPlays: return this.groupPlayPercent
            case ViewInfoType.PercentGroupPlaytime: return this.groupPlaytimePercent
            default: return -1
        }
    }
}
export interface Combination {
    id: string,
    index: number,
    listens: Listen[],
    plays: number,
    playtime: number,
    visiblePlays: number,
    visiblePlaytime: number,
    totalPlayPercent: number,
    totalPlaytimePercent: number,
    groupPlayPercent: number,
    groupPlaytimePercent: number,
    recalculateTotals: (totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) => void,
    percent: (primaryInfo: ViewInfoTypePercent) => number
}