import { HistoryEntry } from "./HistoryEntry"
import { Listen } from "./Listen"
import { FilterOperation, PercentDenominator, PercentGrouping, PercentInfo, PercentNumerator, PercentOf, SkipFilterType } from "./Operations"


export class TrackCombination implements Combination {
    public id: string = crypto.randomUUID()
    
    public rank: number = -1

    public plays: number = -1
    public playtime: number = -1

    public visiblePlays: number = -1
    public visiblePlaytime: number = -1
    
    public numeratorListens: Listen[] = []
    public denominatorListens: Listen[] = []
    public numerator: number = -1
    public denominator: number = -1
    public percent: number = -1

    constructor(
        public trackName: string,
        public artistName: string,
        public albumName: string,
        public trackURI: string,
        public listens: Listen[],
    ) {
        this.plays = this.listens.length
        this.playtime = this.listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }

    recalculateVisible() {
        this.visiblePlays = this.listens.filter(l => !l.hiddenSkip && !l.hiddenSearched).length
        this.visiblePlaytime = this.listens.filter(l => !l.hiddenSkip && !l.hiddenSearched).reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }
    recalculateDenominator(percentInfo: PercentInfo) {
        switch(percentInfo.denominator) {
            case PercentDenominator.All: this.denominatorListens = this.listens; break;
            case PercentDenominator.SkipFilter: this.denominatorListens = this.listens.filter(l => !l.hiddenSkip); break;
            case PercentDenominator.SearchFilter: this.denominatorListens = this.listens.filter(l => !l.hiddenSearched); break;
        }
    }
    recalculatePercents(percentInfo: PercentInfo, totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) {
        switch(percentInfo.numerator) {
            case PercentNumerator.All: this.numeratorListens = this.denominatorListens; break;
            case PercentNumerator.Skipped: this.numeratorListens = this.denominatorListens.filter(l => !l.hiddenSkip); break;
            case PercentNumerator.Searched: this.numeratorListens = this.denominatorListens.filter(l => !l.hiddenSearched); break;
        }
        
        this.numerator = (percentInfo.of == PercentOf.Plays) ? this.numeratorListens.length : this.numeratorListens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
        switch(percentInfo.grouping) {
            case PercentGrouping.Total: this.denominator = (percentInfo.of == PercentOf.Plays) ? totalPlays : totalPlaytime; break;
            case PercentGrouping.Groups: this.denominator = (percentInfo.of == PercentOf.Plays) ? groupPlays : groupPlaytime; break;
        }
        this.percent = this.numerator / this.denominator

    
        
        // this.visiblePlays = this.listens.filter(l => !l.hidden).length
        // this.visiblePlaytime = this.listens.filter(l => !l.hidden).reduce((acc, l) => acc + l.millisecondsPlayed, 0)

        // this.totalPlayPercent = this.visiblePlays / totalPlays
        // this.totalPlaytimePercent = this.visiblePlaytime / totalPlaytime
        // this.groupPlayPercent = this.visiblePlays / groupPlays
        // this.groupPlaytimePercent = this.visiblePlaytime / groupPlaytime
    }
}
export class ArtistCombination implements Combination {
    public id: string = crypto.randomUUID()

    public rank: number = -1

    public plays: number = -1
    public playtime: number = -1

    public visiblePlays: number = -1
    public visiblePlaytime: number = -1

    public numeratorListens: Listen[] = []
    public denominatorListens: Listen[] = []
    public numerator: number = -1
    public denominator: number = -1
    public percent: number = -1

    constructor(
        public artistName: string,
        public listens: Listen[],
    ) {
        this.plays = this.listens.length
        this.playtime = this.listens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }

    recalculateVisible() {
        this.visiblePlays = this.listens.filter(l => !l.hiddenSkip && !l.hiddenSearched).length
        this.visiblePlaytime = this.listens.filter(l => !l.hiddenSkip && !l.hiddenSearched).reduce((acc, l) => acc + l.millisecondsPlayed, 0)
    }
    recalculateDenominator(percentInfo: PercentInfo) {
        switch(percentInfo.denominator) {
            case PercentDenominator.All: this.denominatorListens = this.listens; break;
            case PercentDenominator.SkipFilter: this.denominatorListens = this.listens.filter(l => !l.hiddenSkip); break;
            case PercentDenominator.SearchFilter: this.denominatorListens = this.listens.filter(l => !l.hiddenSearched); break;
        }
    }
    recalculatePercents(percentInfo: PercentInfo, totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) {
        switch(percentInfo.numerator) {
            case PercentNumerator.All: this.numeratorListens = this.denominatorListens; break;
            case PercentNumerator.Skipped: this.numeratorListens = this.denominatorListens.filter(l => !l.hiddenSkip); break;
            case PercentNumerator.Searched: this.numeratorListens = this.denominatorListens.filter(l => !l.hiddenSearched); break;
        }
        
        this.numerator = (percentInfo.of == PercentOf.Plays) ? this.numeratorListens.length : this.numeratorListens.reduce((acc, l) => acc + l.millisecondsPlayed, 0)
        switch(percentInfo.grouping) {
            case PercentGrouping.Total: this.denominator = (percentInfo.of == PercentOf.Plays) ? totalPlays : totalPlaytime; break;
            case PercentGrouping.Groups: this.denominator = (percentInfo.of == PercentOf.Plays) ? groupPlays : groupPlaytime; break;
        }
        this.percent = this.numerator / this.denominator
    }
}
export interface Combination {
    id: string,
    rank: number,
    listens: Listen[],
    plays: number,
    playtime: number,
    visiblePlays: number,
    visiblePlaytime: number,
    numeratorListens: Listen[],
    denominatorListens: Listen[],
    numerator: number,
    denominator: number,
    percent: number,
    recalculateVisible: () => void,
    recalculateDenominator: (percentInfo: PercentInfo) => void,
    recalculatePercents: (percentInfo: PercentInfo, totalPlays: number, totalPlaytime: number, groupPlays: number, groupPlaytime: number) => void,
}