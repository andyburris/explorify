import { CombineInto, CombineType, Operations, GroupOperation, GroupSortType, ItemSortType, SortOperation, FilterOperation, SkipFilterType, SearchType } from "./model/Operations";
import { ArtistCombination, Combination, Group, GroupType, TrackCombination } from "./model/Group";
import { HistoryEntry } from "./model/HistoryEntry";

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

    let groupMap: Map<number, HistoryEntry[] | Combination[]>;
    if(groupOperation.groupBy == GroupType.None) {
        groupMap = new Map()
        const timestamp = ("timestamp" in groupable[0]) ? groupable[0].timestamp : groupable[0].listens[0].timestamp
        groupMap.set(timestamp.getTime(), groupable)
    } else {
        groupMap = groupable.reduce((groups, entry) => {
            const timestamp = ("timestamp" in entry) ? entry.timestamp : entry.listens[0].timestamp
            const roundedDate = roundDate(timestamp, groupOperation.groupBy).getTime()
            if(groups.has(roundedDate)) {
                groups.get(roundedDate).push(entry)
            } else {
                groups.set(roundedDate, [entry])
            }
            return groups
        }, new Map())
    }
     
    return Array.from(groupMap.entries())
        .map(([date, groupables]) => {
            const combinations: Combination[] = ("timestamp" in groupables[0]) ? combineItems(groupables as HistoryEntry[], groupOperation) : groupables as Combination[]
            return new Group(groupOperation.groupBy, new Date(date), combinations)
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
        if(groupOperation.combineBy == CombineType.SameArtist) return new ArtistCombination(0, key, entries)
        
        const firstListen = entries[0]
        return new TrackCombination(0, firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, entries)
    })
}

function applySort(groups: Group[], sortOperation: SortOperation) {
    groups.sort((a, b) => {
        switch(sortOperation.sortGroupsBy) {
            case GroupSortType.Date: return (sortOperation.sortGroupsAscending) ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
            case GroupSortType.Plays: return (sortOperation.sortGroupsAscending) ? a.totalPlays - b.totalPlays : b.totalPlays - a.totalPlays
        }
    })
    groups.forEach(g => {
        g.combinations.sort((a, b) => {
            switch(sortOperation.sortItemsBy) {
                case ItemSortType.Date: return (sortOperation.sortItemsAscending) ? a.listens[0].timestamp.getTime() - b.listens[0].timestamp.getTime() : b.listens[0].timestamp.getTime() - a.listens[0].timestamp.getTime()
                case ItemSortType.Plays: return (sortOperation.sortItemsAscending) ? a.listens.length - b.listens.length : b.listens.length - a.listens.length
                case ItemSortType.Name: {
                    return (a instanceof TrackCombination)
                        ? a.trackName.localeCompare((b as TrackCombination).trackName) * ((sortOperation.sortItemsAscending) ? 1 : -1)
                        : (a as ArtistCombination).artistName.localeCompare((b as ArtistCombination).artistName)  * ((sortOperation.sortItemsAscending) ? 1 : -1)
                }
                case ItemSortType.ArtistName: {
                    return (a instanceof TrackCombination)
                        ? a.artistName.localeCompare((b as TrackCombination).artistName) * ((sortOperation.sortItemsAscending) ? 1 : -1)
                        : (a as ArtistCombination).artistName.localeCompare((b as ArtistCombination).artistName)  * ((sortOperation.sortItemsAscending) ? 1 : -1)
                }
            }
        })
        g.combinations.forEach((c, i) => c.index = i)
    })
}

function roundDate(date: Date, groupType: GroupType): Date {
    const roundedDate = new Date(date);
    switch (groupType) {
        case GroupType.None: throw Error("Shouldn't round for GroupType.None"); break;
        case GroupType.Hour: roundedDate.setMinutes(0, 0, 0); break;
        case GroupType.Day: roundedDate.setHours(0, 0, 0, 0); break;
        case GroupType.Month: roundedDate.setDate(0); roundedDate.setHours(0, 0, 0, 0); break;
        case GroupType.Year: roundedDate.setMonth(0, 0); roundedDate.setHours(0, 0, 0, 0); break;
    }
    return roundedDate;
}