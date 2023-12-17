import { defaultPresets, groupNone } from "../Defaults";
import { CombineInto, CombineType, GroupSortOrder, GroupSortOrderItem, GroupType, ItemSortType, Operations, SearchType, SkipFilterType } from "../model/Operations";
import { ViewInfoType } from "../model/ViewOptions";
import { hashSortedIndices, unhashSortedIndices } from "./HashSort";

interface HashSegment { value: number | boolean, numberOfBits: number }
interface HashSegmentSetter { setter: (value: number) => void, numberOfBits: number }
function segmentsToHashBigint(segments: HashSegment[]): bigint {
    return segments.reduce((acc, segment) => {
        const numberValue: number = typeof(segment.value) === "number" ? segment.value : (segment.value ? 1 : 0)
        return { 
            value: acc.value + BigInt((Math.pow(2, acc.numberOfBits)) * numberValue), 
            numberOfBits: acc.numberOfBits + segment.numberOfBits
        }
    }, { value: BigInt(0), numberOfBits: 0 })
    .value as bigint
}
function segmentsToHashNumber(segments: HashSegment[]): number {
    return segments.reduce((acc, segment) => {
        const numberValue: number = typeof(segment.value) === "number" ? segment.value : (segment.value ? 1 : 0)
        return { 
            value: (acc.value as number) + (Math.pow(2, acc.numberOfBits) * numberValue), 
            numberOfBits: acc.numberOfBits + segment.numberOfBits
        }
    }, { value: 0, numberOfBits: 0 })
    .value as number
}
function applyHashToSegments(hash: number, segmentSetters: HashSegmentSetter[]) {
    segmentSetters.reduce((acc, segmentSetter) => {
        const hashSlice = (hash / Math.pow(2, acc)) % Math.pow(2, acc + segmentSetter.numberOfBits)
        segmentSetter.setter(hashSlice)
        return acc + segmentSetter.numberOfBits
    }, 0)
}
function countBits(segments: HashSegment[]) { return segments.reduce((acc, s) => acc + s.numberOfBits, 0)}

export function hashOperations(operations: Operations, inBinary?: boolean): string {
    const version = '1' //increment the first character each version upgrade to ensure breaking changes are handled

    const segments: HashSegment[] = [
        hashGroupType(operations.group.groupBy),
        { value: operations.group.combineBy, numberOfBits: 2 },
        { value: operations.group.combineInto, numberOfBits: 1 },
        { value: operations.group.combineAcrossGroups, numberOfBits: 1 },

        { value: operations.filter.filterSkipsBy, numberOfBits: 2 },
        { value: operations.filter.searchBy, numberOfBits: 2 },
        { value: operations.filter.rerankSearch, numberOfBits: 1 },
        
        hashGroupSort(operations.sort.sortGroupsBy),
        { value: operations.sort.sortItemsBy, numberOfBits: 2 },
        { value: operations.sort.sortItemsAscending, numberOfBits: 1 },

        { value: operations.viewOptions.primaryInfo, numberOfBits: 1 },
        { value: (operations.viewOptions.secondaryInfo ?? -1) + 1, numberOfBits: 2 },
        { value: operations.viewOptions.showSearch, numberOfBits: 1 },
        { value: operations.viewOptions.showItems, numberOfBits: 1 },
        { value: operations.viewOptions.showItemRanks, numberOfBits: 1 },
        { value: operations.viewOptions.showGroupSum, numberOfBits: 1 },
        { value: operations.viewOptions.previewGroups, numberOfBits: 1 },
    ]
    const numberOfBits = countBits(segments)
    const asBigint = segmentsToHashBigint(segments)
    if(inBinary == true) return asBigint.toString(2).padStart(numberOfBits, '0')
    return version + asBigint.toString(36).padStart(numberOfBits / 5, '0')
}

function parseHash(hash: string): Operations {
    const operations: Operations = defaultPresets[0].operations;
    const version = hash.at(0)

    const hashNumber = parseInt(hash, 16)
    let segments: HashSegmentSetter[]
    switch(version) {
        case '1': {
            segments = [
                { setter: (n) => operations.group.groupBy = parseGroupType(n), numberOfBits: 3 },
                { setter: (n) => operations.group.combineBy = n as CombineType, numberOfBits: 2 },
                { setter: (n) => operations.group.combineInto = n as CombineInto, numberOfBits: 1 },
                { setter: (n) => operations.group.combineAcrossGroups = !!n, numberOfBits: 1 },
        
                { setter: (n) => operations.filter.filterSkipsBy = n as SkipFilterType, numberOfBits: 2 },
                { setter: (n) => operations.filter.searchBy = n as SearchType, numberOfBits: 2 },
                { setter: (n) => operations.filter.rerankSearch = !!n, numberOfBits: 1 },
                
                { setter: (n) => applyGroupSort(n, operations.sort.sortGroupsBy), numberOfBits: 1 },
                { setter: (n) => operations.sort.sortItemsBy = n as ItemSortType, numberOfBits: 2 },
                { setter: (n) => operations.sort.sortItemsAscending = !!n, numberOfBits: 1 },
        
                { setter: (n) => operations.viewOptions.primaryInfo = n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.secondaryInfo = (n == 0 ? null : n - 1 as ViewInfoType), numberOfBits: 2 },
                { setter: (n) => operations.viewOptions.showSearch = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showItems = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showItemRanks = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showGroupSum = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.previewGroups = !!n, numberOfBits: 1 },        
            ]
        }
        default: throw Error(`unsupported version: ${version}`)
    }
    applyHashToSegments(hashNumber, segments)
}

function hashGroupType(groupType: GroupType): HashSegment {
    const segments: HashSegment[] = [
        { value: groupType.hour, numberOfBits: 1 },
        { value: groupType.dayOfWeek, numberOfBits: 1 },
        { value: groupType.date, numberOfBits: 1 },
        { value: groupType.month, numberOfBits: 1 },
        { value: groupType.year, numberOfBits: 1 },
        { value: groupType.artist, numberOfBits: 1 },
        { value: groupType.song, numberOfBits: 1 },
        { value: groupType.album, numberOfBits: 1 },
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}

function parseGroupType(hash: number): GroupType {
    const groupType = groupNone
    const segments: HashSegmentSetter[] = [
        { setter: (n) => groupType.hour = !!n, numberOfBits: 3 },
        { setter: (n) => groupType.dayOfWeek = !!n, numberOfBits: 2 },
        { setter: (n) => groupType.date = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.month = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.year = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.artist = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.song = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.album = !!n, numberOfBits: 1 },
    ]
    applyHashToSegments(hash, segments)
    return groupType
}

function hashGroupSort(sortOrder: GroupSortOrder): HashSegment {
    const segments: HashSegment[] = [
        hashGroupSortOrder(sortOrder),
        hashGroupSortDirections(sortOrder)
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}

function applyGroupSort(hash: number, sortOrder: GroupSortOrder) {
    const groupSortOrder = defaultPresets[0].operations.sort.sortGroupsBy
    const segments: HashSegmentSetter[] = [
        { setter: (n) => applyGroupSortOrder(n, groupSortOrder), numberOfBits: 9 },
        { setter: (n) => applyGroupSortDirections(n, groupSortOrder), numberOfBits: 4 },
    ]
    applyHashToSegments(hash, segments)
}

function hashGroupSortOrder(sortOrder: GroupSortOrder): HashSegment {
    const initialSortOrder = "000000000".split('')
    initialSortOrder[sortOrder.album.index] = 'l'
    initialSortOrder[sortOrder.artist.index] = 'a'
    initialSortOrder[sortOrder.song.index] = 't'
    initialSortOrder[sortOrder.hour.index] = 'h'
    initialSortOrder[sortOrder.dayOfWeek.index] = 'w'
    initialSortOrder[sortOrder.date.index] = 'd'
    initialSortOrder[sortOrder.month.index] = 'm'
    initialSortOrder[sortOrder.year.index] = 'y'
    initialSortOrder[sortOrder.sum.index] = 's'
    const hashed = hashSortedIndices(Object.entries(sortOrder).map(([k, v]) => v.index))

    return { value: hashed, numberOfBits: hashed.toString(2).length }
}

function applyGroupSortOrder(hash: number, sortOrder: GroupSortOrder) {
    unhashSortedIndices(hash, Object.keys(sortOrder)).forEach(k => sortOrder[k.key as keyof GroupSortOrder].index = k.index)
}

function hashGroupSortDirections(sortOrder: GroupSortOrder): HashSegment {
    const segments: HashSegment[] = [
        { value: sortOrder.hour.isAscending, numberOfBits: 1 },
        { value: sortOrder.dayOfWeek.isAscending, numberOfBits: 1 },
        { value: sortOrder.date.isAscending, numberOfBits: 1 },
        { value: sortOrder.month.isAscending, numberOfBits: 1 },
        { value: sortOrder.year.isAscending, numberOfBits: 1 },
        { value: sortOrder.artist.isAscending, numberOfBits: 1 },
        { value: sortOrder.song.isAscending, numberOfBits: 1 },
        { value: sortOrder.album.isAscending, numberOfBits: 1 },
        { value: sortOrder.sum.isAscending, numberOfBits: 1 },
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}

function applyGroupSortDirections(hash: number, sortOrder: GroupSortOrder) {
    const segments: HashSegmentSetter[] = [
        { setter: (n) => sortOrder.hour.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.dayOfWeek.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.date.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.month.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.year.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.artist.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.song.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.album.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.sum.isAscending = !!n, numberOfBits: 1 },
    ]
    applyHashToSegments(hash, segments)
}