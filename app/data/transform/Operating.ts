import { GroupType, CombineInto, CombineType, Operations, GroupOperation, FilterOperation, SkipFilterType, SearchType, InfoOperation } from "../model/Operations";
import { Group, GroupKey, groupKeyFromHashCode } from "../model/Group";
import { HistoryEntry } from "../model/HistoryEntry";
import { Combination, ArtistCombination, TrackCombination } from "../model/Combination";
import { applySort } from "./Sorting";
import { Listen, ViewState } from "../model/Listen";

const DIVIDER = "᭺"

function toListen(entry: HistoryEntry): Listen { return { 
    ...entry, 
    hiddenSkip: false, 
    hiddenSearched: false, 
    trackName: entry.trackName.replaceAll(DIVIDER, ""),
    artistName: entry.artistName.replaceAll(DIVIDER, ""),
    albumName: entry.albumName.replaceAll(DIVIDER, ""),
 } }
export function applyOperations(entries: HistoryEntry[], operations: Operations): Group[] {
    const listens = entries.map(toListen)
    applyFilters(listens, operations.filter)
    // const groups = groupItems(listens, operations.group)
    const groups = groupAndCombineItems(listens, operations.group)
    applyPercents(groups, operations.info) 
    const filteredHidden = filterHidden(groups, operations.filter.minimumGroupPlays)
    applySort(filteredHidden, operations.sort, operations.info)
    return filteredHidden
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

function applyFilters(listens: Listen[], operation: FilterOperation) {
    listens.forEach(l => {
        l.hiddenSearched = !filterSearch(l, operation)
        l.hiddenSkip = !filterSkip(l, operation)
    })
}

function applyPercents(groups: Group[], infoOperation: InfoOperation) {
    groups.forEach(g => {
        g.combinations.forEach(c => {
            c.recalculateDenominator(infoOperation.primaryPercent)
        })   
        g.recalculateDenominators()
    })

    const totalPlays = groups.reduce((acc, g) => acc + g.playsDenominator, 0)
    const totalPlaytime = groups.reduce((acc, g) => acc + g.playtimeDenominator, 0)

    groups.forEach(g => g.recalculatePercents(infoOperation.primaryPercent, totalPlays, totalPlaytime))
}

function filterHidden(groups: Group[], minGroupPlays: number): Group[] {
    return groups.filter(g => {
        g.combinations = g.combinations.filter(c => c.visiblePlays > 0)
        return (g.visiblePlays >= minGroupPlays) && (g.combinations.length > 0)
    })
}

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
function toCombinationKey(listen: Listen, groupOperation: GroupOperation): string {
    const key = (groupOperation.combineBy == CombineType.None) ? listen.id : (groupOperation.combineBy == CombineType.SameArtist) ? listen.artistName.toLowerCase() : `${listen.trackName} - ${listen.artistName}`.toLowerCase()
    return key
}

function groupAndCombineItems(listens: Listen[], groupOperation: GroupOperation): Group[] {
    const groups: Map<string, Combination[]> = new Map()
    if(groupOperation.combineAcrossGroups) {
        const combinations: Map<string, Listen[]> = new Map()
        listens.forEach(listen => {
            const combinationKey = toCombinationKey(listen, groupOperation)
            if(combinations.has(combinationKey)) {
                combinations.get(combinationKey)!.push(listen)
            } else {
                combinations.set(combinationKey, [listen])
            }
        })

        combinations.forEach((listens, key) => {
            const firstListen = groupOperation.combineInto == CombineInto.EarliestPlay
                ? listens.reduce((acc, l) => (!l.hiddenSearched && !l.hiddenSkip) && (l.timestamp.getTime() < acc.timestamp.getTime()) ? l : acc, listens[0])
                : listens.reduce((acc, l) => (!l.hiddenSearched && !l.hiddenSkip) && (l.timestamp.getTime() > acc.timestamp.getTime()) ? l : acc, listens[0])
            const groupKey = toGroupKey(firstListen, groupOperation.groupBy).hashCode
            const combination = (groupOperation.combineBy == CombineType.SameArtist) 
                ? new ArtistCombination(firstListen.artistName, listens)
                : new TrackCombination(firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, listens)
            if(groups.has(groupKey)) {
                groups.get(groupKey)!.push(combination)
            } else {
                groups.set(groupKey, [combination])
            }
        })
    } else {
        const combinationAndGroupMap: Map<string, Listen[]> = new Map()
        listens.forEach(listen => {
            const groupKey = toGroupKey(listen, groupOperation.groupBy)
            const combinationKey = toCombinationKey(listen, groupOperation)
            const bothKey = `${groupKey.hashCode}${DIVIDER}${combinationKey}`
            if(combinationAndGroupMap.has(bothKey)) {
                combinationAndGroupMap.get(bothKey)!.push(listen)
            } else {
                combinationAndGroupMap.set(bothKey, [listen])
            }
        })    
        combinationAndGroupMap.forEach((listens, key) => {
            const listen = listens[0]
            const combination = (groupOperation.combineBy == CombineType.SameArtist) 
                ? new ArtistCombination(listen.artistName, listens)
                : new TrackCombination(listen.trackName, listen.artistName, listen.albumName, listen.uri, listens)
            const groupKey = key.substring(0, key.indexOf(DIVIDER))
            if(groups.has(groupKey)) {
                groups.get(groupKey)!.push(combination)
            } else {
                groups.set(groupKey, [combination])
            }
        })
    }
    return Array.from(groups.entries()).map(([key, combinations]) => new Group(groupOperation.groupBy, groupKeyFromHashCode(key), combinations))
}