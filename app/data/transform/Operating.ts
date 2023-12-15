import { GroupType, CombineInto, CombineType, Operations, GroupOperation, FilterOperation, SkipFilterType, SearchType } from "../model/Operations";
import { Group, GroupKey, groupKeyFromHashCode } from "../model/Group";
import { HistoryEntry } from "../model/HistoryEntry";
import { Combination, ArtistCombination, TrackCombination } from "../model/Combination";
import { applySort } from "./Sorting";

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
    const filtered = filterItems(listens, operations.filter)
    const grouped = groupItems(filtered, operations.group)
    applySort(grouped, operations.sort)
    if(!operations.filter.rerankSearch) return filterItemsKeepRank(grouped, operations.filter)
    return grouped
}

function filterItems(items: HistoryEntry[], filterOperation: FilterOperation): HistoryEntry[] {
    const filteredSkips = items.filter(he => {
        switch(filterOperation.filterSkipsBy) {
            case SkipFilterType.All: return true
            case SkipFilterType.NoSkips: return he.millisecondsPlayed >= 30 * 1000
            case SkipFilterType.OnlySkips: return he.millisecondsPlayed <= 30 * 1000
        }
    })
    if(!filterOperation.rerankSearch) return filteredSkips

    return filteredSkips.filter(he => filterItem(he, filterOperation))
}

function filterItem(listen: HistoryEntry, operation: FilterOperation) : boolean{
    switch(operation.searchBy) {
        case SearchType.All: return listen.trackName.toLowerCase().includes(operation.searchTerm.toLowerCase()) || listen.artistName.toLowerCase().includes(operation.searchTerm.toLowerCase())
        case SearchType.SongName: return listen.trackName.toLowerCase().includes(operation.searchTerm.toLowerCase())
        case SearchType.ArtistName: return listen.artistName.toLowerCase().includes(operation.searchTerm.toLowerCase())
    }
}

function filterItemsKeepRank(groups: Group[], operation: FilterOperation): Group[]{
    return groups.map(g => {
        g.combinations = g.combinations.map(c => {
            c.listens = c.listens.filter(l => filterItem(l, operation))
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

function combineItems(items: HistoryEntry[], groupOperation: GroupOperation): Combination[] {
    const combinationMap: Map<string, HistoryEntry[]> = items.reduce((groups, entry) => {
        const key = (groupOperation.combineBy == CombineType.None) ? entry.id : (groupOperation.combineBy == CombineType.SameArtist) ? entry.artistName.toLowerCase() : `${entry.trackName} - ${entry.artistName}`.toLowerCase()
        if(groups.has(key)) groups.get(key).push(entry); else groups.set(key, [entry])
        return groups
    }, new Map())
    return Array.from(combinationMap).map(([key, entries]) => {
        entries.sort((a, b) => (groupOperation.combineInto == CombineInto.EarliestPlay) ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime())
        if(groupOperation.combineBy == CombineType.SameArtist) return new ArtistCombination(0, entries[0].artistName, entries)
        
        const firstListen = entries[0]
        return new TrackCombination(0, firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, entries)
    })
}
