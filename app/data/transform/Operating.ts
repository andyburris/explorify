import { GroupType, CombineInto, CombineType, Operations, GroupOperation, FilterOperation, SkipFilterType, SearchType } from "../model/Operations";
import { Group, GroupKey, groupKeyFromHashCode } from "../model/Group";
import { HistoryEntry } from "../model/HistoryEntry";
import { Combination, ArtistCombination, TrackCombination } from "../model/Combination";
import { applySort } from "./Sorting";
import { ViewState } from "../model/Listen";

function toGroupKey(listen: HistoryEntry, type: GroupType): GroupKey {
    return new GroupKey(
        type.hour ? listen.timestamp.getHours() : null,
        type.dayOfWeek ? listen.timestamp.getDay() : null,
        type.date ? listen.timestamp.getDate() : null,
        type.month ? listen.timestamp.getMonth() : null,
        type.year ? listen.timestamp.getFullYear() : null,
        type.artist ? listen.artistName : null,
        type.song ? listen.trackName : null,
        type.album ? listen.albumName : null,
    )
}

export function applyOperations(listens: HistoryEntry[], operations: Operations): Group[] {
    const filtered = filterValidItems(listens, operations.filter)
    const grouped = groupItems(filtered, operations.group)
    applyHidden(grouped, operations.filter, filtered.length, filtered.reduce((acc, l) => acc + l.millisecondsPlayed, 0))
    applySort(grouped, operations.sort, operations.viewOptions)
    const filteredRanks = filterHiddenRanks(grouped, operations.filter)
    return filteredRanks
}

function filterValidItems(items: HistoryEntry[], filterOperation: FilterOperation): HistoryEntry[] {
    const filteredSkips = filterOperation.excludeSkipsFromTotal
        ? items.filter(he => filterSkip(he, filterOperation))
        : items
    const filteredSearch = filterOperation.excludeSearchFromTotal
        ? filteredSkips.filter(he => filterSearch(he, filterOperation))
        : filteredSkips
    return filteredSearch
}

function filterSkip(listen: HistoryEntry, filterOperation: FilterOperation): boolean {
    switch(filterOperation.filterSkipsBy) {
        case SkipFilterType.All: return true
        case SkipFilterType.NoSkips: return listen.millisecondsPlayed >= 30 * 1000
        case SkipFilterType.OnlySkips: return listen.millisecondsPlayed <= 30 * 1000
    }
}
function filterSearch(listen: HistoryEntry, operation: FilterOperation) : boolean {
    switch(operation.searchBy) {
        case SearchType.All: return listen.trackName.toLowerCase().includes(operation.searchTerm.toLowerCase()) || listen.artistName.toLowerCase().includes(operation.searchTerm.toLowerCase())|| listen.albumName.toLowerCase().includes(operation.searchTerm.toLowerCase())
        case SearchType.SongName: return listen.trackName.toLowerCase().includes(operation.searchTerm.toLowerCase())
        case SearchType.ArtistName: return listen.artistName.toLowerCase().includes(operation.searchTerm.toLowerCase())
        case SearchType.AlbumName: return listen.albumName.toLowerCase().includes(operation.searchTerm.toLowerCase())
    }
}

function applyHidden(groups: Group[], operation: FilterOperation, totalPlays: number, totalPlaytime: number) {
    groups.forEach(g => {
        g.combinations.forEach(c => {
            c.listens.forEach(l => {
                if(l.viewState == ViewState.Invalid) return
                const hideSearch = (!operation.excludeSearchFromTotal) ? !filterSearch(l, operation) : false
                const hideSkip = (!operation.excludeSkipsFromTotal) ? !filterSkip(l, operation) : false
                l.viewState = (hideSearch || hideSkip) ? ViewState.Hidden : ViewState.Visible
            })
            c.recalculateTotals(totalPlays, totalPlaytime, g.plays, g.playtime)
            //todo: calculate group plays/playtime before percents
        })   
        g.recalculateTotals(totalPlays, totalPlaytime)
    })
}

function filterHiddenRanks(groups: Group[], operation: FilterOperation): Group[]{
    return groups.map(g => {
        g.combinations = g.combinations.map(c => {
            c.listens = c.listens.filter(l => filterSearch(l, operation))
            return c
        })
        g.combinations = g.combinations.filter(c => c.listens.length > 0)
        return g
    })
}

function groupItems(items: HistoryEntry[], groupOperation: GroupOperation): Group[] {
    const groupable = (groupOperation.combineAcrossGroups) ? combineItems(items, groupOperation) : items

    let groupMap: Map<string, HistoryEntry[] | Combination[]> = groupable.reduce((groups, entry) => {
        const listen = ("timestamp" in entry ? entry as HistoryEntry : (entry as Combination).listens[0])
        const key = toGroupKey(listen, groupOperation.groupBy)
        if(groups.has(key.hashCode())) {
            groups.get(key.hashCode()).push(entry)
        } else {
            groups.set(key.hashCode(), [entry])
        }
        return groups
    }, new Map())
     
    return Array.from(groupMap.entries())
        .map(([key, groupables]) => {
            const combinations: Combination[] = ("timestamp" in groupables[0]) ? combineItems(groupables as HistoryEntry[], groupOperation) : groupables as Combination[]
            return new Group(groupOperation.groupBy, groupKeyFromHashCode(key), combinations)
        })
}

function toListen(entry: HistoryEntry) { return { ...entry, viewState: ViewState.Visible } }
function combineItems(items: HistoryEntry[], groupOperation: GroupOperation): Combination[] {
    const combinationMap: Map<string, HistoryEntry[]> = items.reduce((groups, entry) => {
        const key = (groupOperation.combineBy == CombineType.None) ? entry.id : (groupOperation.combineBy == CombineType.SameArtist) ? entry.artistName.toLowerCase() : `${entry.trackName} - ${entry.artistName}`.toLowerCase()
        if(groups.has(key)) groups.get(key).push(entry); else groups.set(key, [entry])
        return groups
    }, new Map())
    return Array.from(combinationMap).map(([key, entries]) => {
        entries.sort((a, b) => (groupOperation.combineInto == CombineInto.EarliestPlay) ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime())
        if(groupOperation.combineBy == CombineType.SameArtist) return new ArtistCombination(0, entries[0].artistName, entries.map(toListen))
        
        const firstListen = entries[0]
        return new TrackCombination(0, firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, entries.map(toListen))
    })
}
