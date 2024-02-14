import { TrackCombination, ArtistCombination } from "../model/Combination"
import { Group, GroupKey } from "../model/Group"
import { SortOperation, ItemSortType, GroupSortOrder, GroupSortOrderItem, GroupType, InfoOperation, InfoType } from "../model/Operations"

export function applySort(groups: Group[], sortOperation: SortOperation, infoOperation: InfoOperation) {
    sortGroups(groups, sortOperation.sortGroupsBy, infoOperation)
    groups.forEach((g, i) => {
        g.combinations.sort((a, b) => {
            switch(sortOperation.sortItemsBy) {
                case ItemSortType.Date: return (sortOperation.sortItemsAscending) ? a.listens[0].timestamp.getTime() - b.listens[0].timestamp.getTime() : b.listens[0].timestamp.getTime() - a.listens[0].timestamp.getTime()
                case ItemSortType.Plays: return (sortOperation.sortItemsAscending) ? a.visiblePlays - b.visiblePlays : b.visiblePlays - a.visiblePlays
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
                case ItemSortType.Playtime: return (sortOperation.sortItemsAscending) ? a.visiblePlaytime - b.visiblePlaytime : b.visiblePlaytime - a.visiblePlaytime
            }
        })
        g.combinations.forEach((c, i) => c.rank = i)
        g.rank = i
    })
}

type GroupSortFunction = (g1: Group, g2: Group) => number
export function sortItemsInOrder(order: GroupSortOrder): [string, GroupSortOrderItem][] {
    return Object.entries(order)
    .map(([k, v]) => [k, v] as [string, GroupSortOrderItem])
    .toSorted(([k1, v1], [k2, v2]) => v1.index - v2.index)
    // .filter(([key, _]) => groups[0].key[key as keyof GroupKey] !== null)
}
function sortGroups(groups: Group[], groupSortOrder: GroupSortOrder, infoOperation: InfoOperation) {
    const sortFunctionsInOrder: [item: GroupSortOrderItem, fun: GroupSortFunction][] = 
        sortItemsInOrder(groupSortOrder)
        .map(([key, groupSortItem]) => {
            const sortFunction: GroupSortFunction = sortFunctionMap.get(key)!
            return [groupSortItem, sortFunction] 
        })
    groups.sort((g1, g2) => {
        for(var i = 0; i < sortFunctionsInOrder.length; i++) {
            const [item, fun] = sortFunctionsInOrder[i]
            const sortResult = fun(g1, g2) * (item.isAscending ? 1 : -1)
            if(sortResult != 0) return sortResult
        }
        return 0
    })
}

const groupBySong = (g1: Group, g2: Group) => ((g1.key.song ?? g1.combinations[0].listens[0].trackName).toLowerCase()!.localeCompare((g2.key.song ?? g2.combinations[0].listens[0].trackName)))
const groupByArtist = (g1: Group, g2: Group) => ((g1.key.artist ?? g1.combinations[0].listens[0].artistName).toLowerCase()!.localeCompare((g2.key.artist ?? g2.combinations[0].listens[0].artistName)))
const groupByAlbum = (g1: Group, g2: Group) => ((g1.key.album ?? g1.combinations[0].listens[0].albumName).toLowerCase()!.localeCompare((g2.key.album ?? g2.combinations[0].listens[0].albumName)))
const groupByHour = (g1: Group, g2: Group) => ((g1.key.hour ?? g1.combinations[0].listens[0].timestamp.getHours()) - (g2.key.hour ?? g2.combinations[0].listens[0].timestamp.getHours()))
const groupByDay = (g1: Group, g2: Group) => ((g1.key.dayOfWeek ?? g1.combinations[0].listens[0].timestamp.getDay()) - (g2.key.dayOfWeek ?? g2.combinations[0].listens[0].timestamp.getDay()))
const groupByDate = (g1: Group, g2: Group) => ((g1.key.date ?? g1.combinations[0].listens[0].timestamp.getDate()) - (g2.key.date ?? g2.combinations[0].listens[0].timestamp.getDate()))
const groupByMonth = (g1: Group, g2: Group) => ((g1.key.month ?? g1.combinations[0].listens[0].timestamp.getMonth()) - (g2.key.month ?? g2.combinations[0].listens[0].timestamp.getMonth()))
const groupByYear = (g1: Group, g2: Group) => ((g1.key.year ?? g1.combinations[0].listens[0].timestamp.getFullYear()) - (g2.key.year ?? g2.combinations[0].listens[0].timestamp.getFullYear()))

const groupByPlays = (g1: Group, g2: Group) => (g1.visiblePlays - g2.visiblePlays)
const groupByPlaytime = (g1: Group, g2: Group) => (g1.visiblePlaytime - g2.visiblePlaytime)
const groupByPercent = (g1: Group, g2: Group) => (g1.percent - g2.percent)

const sortInPlace = (g1: Group, g2: Group) => 0

const sortFunctionMap: Map<string, GroupSortFunction> = new Map([
    ["song", groupBySong],
    ["album", groupByAlbum],
    ["artist", groupByArtist],
    ["hour", groupByHour],
    ["dayOfWeek", groupByDay],
    ["date", groupByDate],
    ["month", groupByMonth],
    ["year", groupByYear],
    ["plays", groupByPlays],
    ["playtime", groupByPlaytime],
    ["percent", groupByPercent],
])