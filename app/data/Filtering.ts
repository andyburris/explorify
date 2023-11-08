import { CombineInto, CombineType, Filters, GroupFilter, GroupSortType, ItemSortType, SortFilter } from "./model/Filters";
import { ArtistCombination, Combination, Group, GroupType, TrackCombination } from "./model/Group";
import { HistoryEntry } from "./model/HistoryEntry";

export function applyFilters(listens: HistoryEntry[], filters: Filters): Group[] {
    const grouped = groupItems(listens, filters.group)
    applySort(grouped, filters.sort)
    return grouped
}

function groupItems(items: HistoryEntry[], groupFilter: GroupFilter): Group[] {
    const groupable = (groupFilter.combineAcrossGroups) ? combineItems(items, groupFilter) : items

    let groupMap: Map<number, HistoryEntry[] | Combination[]>;
    if(groupFilter.groupBy == GroupType.None) {
        groupMap = new Map()
        const timestamp = ("timestamp" in groupable[0]) ? groupable[0].timestamp : groupable[0].listens[0].timestamp
        groupMap.set(timestamp.getTime(), groupable)
    } else {
        groupMap = groupable.reduce((groups, entry) => {
            const timestamp = ("timestamp" in entry) ? entry.timestamp : entry.listens[0].timestamp
            const roundedDate = roundDate(timestamp, groupFilter.groupBy).getTime()
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
            const combinations: Combination[] = ("timestamp" in groupables[0]) ? combineItems(groupables as HistoryEntry[], groupFilter) : groupables as Combination[]
            return new Group(groupFilter.groupBy, new Date(date), combinations)
        })
}

function combineItems(items: HistoryEntry[], filter: GroupFilter): Combination[] {
    const combinationMap: Map<string, HistoryEntry[]> = items.reduce((groups, entry) => {
        const key = (filter.combineBy == CombineType.None) ? entry.id : (filter.combineBy == CombineType.SameArtist) ? entry.artistName : `${entry.trackName} - ${entry.artistName}`
        if(groups.has(key)) groups.get(key).push(entry); else groups.set(key, [entry])
        return groups
    }, new Map())
    return Array.from(combinationMap).map(([key, entries]) => {
        entries.sort((a, b) => (filter.combineInto == CombineInto.EarliestPlay) ? a.timestamp.getTime() - b.timestamp.getTime() : b.timestamp.getTime() - a.timestamp.getTime())
        if(filter.combineBy == CombineType.SameArtist) return new ArtistCombination(key, entries)
        
        const firstListen = entries[0]
        return new TrackCombination(firstListen.trackName, firstListen.artistName, firstListen.albumName, firstListen.uri, entries)
    })
}

function applySort(groups: Group[], filter: SortFilter) {
    groups.sort((a, b) => {
        switch(filter.sortGroupsBy) {
            case GroupSortType.Date: return (filter.sortGroupsAscending) ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime()
            case GroupSortType.Plays: return (filter.sortGroupsAscending) ? a.totalPlays - b.totalPlays : b.totalPlays - a.totalPlays
        }
    })
    groups.forEach(g => g.combinations.sort((a, b) => {
        switch(filter.sortItemsBy) {
            case ItemSortType.Date: return (filter.sortItemsAscending) ? a.listens[0].timestamp.getTime() - b.listens[0].timestamp.getTime() : b.listens[0].timestamp.getTime() - a.listens[0].timestamp.getTime()
            case ItemSortType.Plays: return (filter.sortItemsAscending) ? a.listens.length - b.listens.length : b.listens.length - a.listens.length
            case ItemSortType.Name: {
                return (a instanceof TrackCombination)
                    ? a.trackName.localeCompare((b as TrackCombination).trackName) * ((filter.sortItemsAscending) ? 1 : -1)
                    : (a as ArtistCombination).artistName.localeCompare((b as ArtistCombination).artistName)  * ((filter.sortItemsAscending) ? 1 : -1)
            }
            case ItemSortType.ArtistName: {
                return (a instanceof TrackCombination)
                    ? a.artistName.localeCompare((b as TrackCombination).artistName) * ((filter.sortItemsAscending) ? 1 : -1)
                    : (a as ArtistCombination).artistName.localeCompare((b as ArtistCombination).artistName)  * ((filter.sortItemsAscending) ? 1 : -1)
            }
        }
    }))
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