import { GroupType, CombineInto, CombineType, Operations, GroupOperation, FilterOperation, SkipFilterType, SearchType, InfoOperation } from "../model/Operations";
import { Group, GroupKey, groupKeyFromHashCode } from "../model/Group";
import { HistoryEntry } from "../model/HistoryEntry";
import { Combination, ArtistCombination, TrackCombination } from "../model/Combination";
import { applySort } from "./Sorting";
import { Listen, ViewState } from "../model/Listen";

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
    return applyNonGroupOperations(applyGroupOperation(listens, operations.group), operations)
}

export function applyGroupOperation(listens: HistoryEntry[], groupOperation: GroupOperation): Group[] {
    // const filtered = filterValidItems(listens, operations.filter)
    return groupItems(listens, groupOperation) 
}

export function applyNonGroupOperations(groups: Group[], operations: Operations): Group[] {
    applyFiltersAndPercents(groups, operations.filter, operations.info)
    const filteredMinPlays = groups.filter(g => g.visiblePlays > operations.filter.minimumPlays)
    applySort(filteredMinPlays, operations.sort, operations.info)
    // const filteredRanks = filterHiddenRanks(groups, operations.filter)
    return filteredMinPlays
}

// function filterValidItems(items: HistoryEntry[], filterOperation: FilterOperation): HistoryEntry[] {
//     if(!filterOperation.hideFilteredPlays) return items 

//     const filteredSkips = items.filter(he => filterSkip(he, filterOperation))
//     const filteredSearch = filteredSkips.filter(he => filterSearch(he, filterOperation))
//     return filteredSearch
// }

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

function applyFiltersAndPercents(groups: Group[], operation: FilterOperation, infoOperation: InfoOperation) {
    groups.forEach(g => {
        g.combinations.forEach(c => {
            c.listens.forEach(l => {
                // if(l.viewState == ViewState.Invalid) return
                // const hideSearch = (!operation.excludeSearchFromTotal) ? !filterSearch(l, operation) : false
                // const hideSkip = (!operation.excludeSkipsFromTotal) ? !filterSkip(l, operation) : false
                // l.viewState = (hideSearch || hideSkip) ? ViewState.Hidden : ViewState.Visible
                l.hiddenSearched = !filterSearch(l, operation)
                l.hiddenSkip = !filterSkip(l, operation)
            })
            c.recalculateVisible()
            c.recalculateDenominator(infoOperation.primaryPercent)
            // c.hiddenMinListens = c.visiblePlays < operation.minimumPlays
        })   
        g.recalculateVisible()
        g.recalculateDenominators()
    })

    const totalPlays = groups.reduce((acc, g) => acc + g.playsDenominator, 0)
    const totalPlaytime = groups.reduce((acc, g) => acc + g.playtimeDenominator, 0)

    groups.forEach(g => g.recalculatePercents(infoOperation.primaryPercent, totalPlays, totalPlaytime))
}

function filterHiddenRanks(groups: Group[], operation: FilterOperation): Group[]{
    return groups.map(g => {
        // g.combinations = g.combinations.map(c => {
        //     c.listens = c.listens.filter(l => filterSearch(l, operation))
        //     return c
        // })
        // g.combinations = g.combinations.filter(c => c.listens.length > 0)
        return g
    }).filter(g => g.visiblePlays >= operation.minimumPlays)
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

function toListen(entry: HistoryEntry): Listen { return { ...entry, hiddenSkip: false, hiddenSearched: false } }
function combineItems(items: HistoryEntry[], groupOperation: GroupOperation): Combination[] {
    const combinationMap: Map<string, HistoryEntry[]> = items.reduce((groups, entry) => {
        const key = (groupOperation.combineBy == CombineType.None) ? entry.id : (groupOperation.combineBy == CombineType.SameArtist) ? entry.artistName.toLowerCase() : `${entry.trackName} - ${entry.artistName}`.toLowerCase()
        if(groups.has(key)) groups.get(key).push(entry); else groups.set(key, [entry])
        return groups
    }, new Map())
    return Array.from(combinationMap).map(([key, entries]) => {
        entries.sort((a, b) => (groupOperation.combineInto == CombineInto.EarliestPlay) ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime())
        if(groupOperation.combineBy == CombineType.SameArtist) return new ArtistCombination(entries[0].artistName, entries.map(toListen))
        
        const firstListen = entries[0]
        return new TrackCombination(firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, entries.map(toListen))
    })
}
