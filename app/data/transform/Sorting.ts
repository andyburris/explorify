import { TrackCombination, ArtistCombination } from "../model/Combination"
import { Group, GroupKey } from "../model/Group"
import { SortOperation, ItemSortType, GroupSortOrder, GroupSortOrderItem, GroupType } from "../model/Operations"

export function applySort(groups: Group[], sortOperation: SortOperation) {
    sortGroups(groups, sortOperation.sortGroupsBy)
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
                case ItemSortType.Playtime: return (sortOperation.sortItemsAscending) ? a.totalPlaytimeMs - b.totalPlaytimeMs : b.totalPlaytimeMs - a.totalPlaytimeMs
            }
        })
        g.combinations.forEach((c, i) => c.index = i)
    })
}

type GroupSortFunction = (g1: Group, g2: Group) => number
export function sortItemsInOrder(order: GroupSortOrder): [string, GroupSortOrderItem][] {
    return Object.entries(order)
    .map(([k, v]) => [k, v] as [string, GroupSortOrderItem])
    .toSorted(([k1, v1], [k2, v2]) => v1.index - v2.index)
    // .filter(([key, _]) => groups[0].key[key as keyof GroupKey] !== null)
}
function sortGroups(groups: Group[], groupSortOrder: GroupSortOrder) {
    const sortFunctionsInOrder: GroupSortFunction[] = 
        sortItemsInOrder(groupSortOrder)
        .map(([key, groupSortItem]) => {
            const sortFunction: (isAscending: boolean) => GroupSortFunction = sortFunctionMap.get(key)!
            return sortFunction(groupSortItem.isAscending)
        })
    groups.sort((g1, g2) => {
        for(var i = 0; i < sortFunctionsInOrder.length; i++) {
            const sortResult = sortFunctionsInOrder[i](g1, g2)
            if(sortResult != 0) return sortResult
        }
        return 0
    })
}

const groupBySong = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.song ?? g1.combinations[0].listens[0].trackName).toLowerCase()!.localeCompare((g2.key.song ?? g2.combinations[0].listens[0].trackName)))
    : (g1: Group, g2: Group) => ((g2.key.song ?? g2.combinations[0].listens[0].trackName).toLowerCase()!.localeCompare((g1.key.song ?? g1.combinations[0].listens[0].trackName)))
const groupByArtist = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.artist ?? g1.combinations[0].listens[0].artistName).toLowerCase()!.localeCompare((g2.key.artist ?? g2.combinations[0].listens[0].artistName)))
    : (g1: Group, g2: Group) => ((g2.key.artist ?? g2.combinations[0].listens[0].artistName).toLowerCase()!.localeCompare((g1.key.artist ?? g1.combinations[0].listens[0].artistName)))
const groupByAlbum = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.album ?? g1.combinations[0].listens[0].albumName).toLowerCase()!.localeCompare((g2.key.album ?? g2.combinations[0].listens[0].albumName)))
    : (g1: Group, g2: Group) => ((g2.key.album ?? g2.combinations[0].listens[0].albumName).toLowerCase()!.localeCompare((g1.key.album ?? g1.combinations[0].listens[0].albumName)))
const groupByHour = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.hour ?? g1.combinations[0].listens[0].timestamp.getHours()) - (g2.key.hour ?? g2.combinations[0].listens[0].timestamp.getHours()))
    : (g1: Group, g2: Group) => ((g2.key.hour ?? g2.combinations[0].listens[0].timestamp.getHours()) - (g1.key.hour ?? g1.combinations[0].listens[0].timestamp.getHours()))
const groupByDay = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.dayOfWeek ?? g1.combinations[0].listens[0].timestamp.getDay()) - (g2.key.dayOfWeek ?? g2.combinations[0].listens[0].timestamp.getDay()))
    : (g1: Group, g2: Group) => ((g2.key.dayOfWeek ?? g2.combinations[0].listens[0].timestamp.getDay()) - (g1.key.dayOfWeek ?? g1.combinations[0].listens[0].timestamp.getDay()))
const groupByDate = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.date ?? g1.combinations[0].listens[0].timestamp.getDate()) - (g2.key.date ?? g2.combinations[0].listens[0].timestamp.getDate()))
    : (g1: Group, g2: Group) => ((g2.key.date ?? g2.combinations[0].listens[0].timestamp.getDate()) - (g1.key.date ?? g1.combinations[0].listens[0].timestamp.getDate()))
const groupByMonth = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.month ?? g1.combinations[0].listens[0].timestamp.getMonth()) - (g2.key.month ?? g2.combinations[0].listens[0].timestamp.getMonth()))
    : (g1: Group, g2: Group) => ((g2.key.month ?? g2.combinations[0].listens[0].timestamp.getMonth()) - (g1.key.month ?? g1.combinations[0].listens[0].timestamp.getMonth()))
const groupByYear = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => ((g1.key.year ?? g1.combinations[0].listens[0].timestamp.getFullYear()) - (g2.key.year ?? g2.combinations[0].listens[0].timestamp.getFullYear()))
    : (g1: Group, g2: Group) => ((g2.key.year ?? g2.combinations[0].listens[0].timestamp.getFullYear()) - (g1.key.year ?? g1.combinations[0].listens[0].timestamp.getFullYear()))
const groupByPlays = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => (g1.totalPlays - g2.totalPlays)
    : (g1: Group, g2: Group) => (g2.totalPlays - g1.totalPlays)
const groupByPlaytime = (isAscending: boolean) => isAscending 
    ? (g1: Group, g2: Group) => (g1.totalPlaytimeMs - g2.totalPlaytimeMs)
    : (g1: Group, g2: Group) => (g2.totalPlaytimeMs - g1.totalPlaytimeMs)

const sortFunctionMap: Map<string, (isAscending: boolean) => GroupSortFunction> = new Map([
    ["song", groupBySong],
    ["album", groupByAlbum],
    ["artist", groupByArtist],
    ["hour", groupByHour],
    ["dayOfWeek", groupByDay],
    ["date", groupByDate],
    ["month", groupByMonth],
    ["year", groupByYear],
    ["totalPlays", groupByPlays],
    ["totalPlaytime", groupByPlaytime],
])