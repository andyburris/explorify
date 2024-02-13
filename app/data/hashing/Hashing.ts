import { assert } from "console";
import { defaultPresets, groupNone } from "../Defaults";
import { CombineInto, CombineType, GroupSortOrder, GroupSortOrderItem, GroupType, InfoType, ItemSortType, Operations, PercentInfo, SearchType, SkipFilterType } from "../model/Operations";
import { factorial, hashSortedIndices, unhashSortedIndices } from "./HashSort";
import { DEBUG } from "../utils/debug";
import { Preset } from "../model/Preset";
import { Base64 } from "../utils/base64";
import { pickableIcons } from "@/app/common/PickedIcon";

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
function applyHashBigintToSegments(hash: bigint, segmentSetters: HashSegmentSetter[]) {
    segmentSetters.reduce((accNumberBits, segmentSetter) => {
        const lowSlice = BigInt(Math.pow(2, accNumberBits))
        const highSlice = BigInt(Math.pow(2, segmentSetter.numberOfBits))
        const hashSlice = (hash / lowSlice) % highSlice
        segmentSetter.setter(Number(hashSlice))
        return accNumberBits + segmentSetter.numberOfBits
    }, 0)
}
function applyHashToSegments(hash: number, segmentSetters: HashSegmentSetter[]) {
    segmentSetters.reduce((acc, segmentSetter) => {
        const lowSlice = Math.pow(2, acc)
        const highSlice = Math.pow(2, segmentSetter.numberOfBits)
        const hashSlice = Math.floor(hash / lowSlice) % highSlice
        segmentSetter.setter(hashSlice)
        return acc + segmentSetter.numberOfBits
    }, 0)
}
function countBits(segments: HashSegment[] | HashSegmentSetter[]) { return segments.reduce((acc, s) => acc + s.numberOfBits, 0)}

export function hashPreset(preset: Preset, includeSearchTerm: boolean): string {
    return hashOperations(preset.operations)
        + `?t=${Base64.encode(preset.name)}`
        + `&d=${Base64.encode(preset.description)}`
        + `&i=${pickableIcons.findIndex(p => p.name == preset.icon).toString(36)}`
        + (includeSearchTerm ? `&s=${Base64.encode(preset.operations.filter.searchTerm)}` : "")
}

export function hashOperations(operations: Operations, inBinary?: boolean): string {
    const version = '1' //increment the first character each version upgrade to ensure breaking changes are handled

    const segments: HashSegment[] = [
        hashGroupType(operations.group.groupBy),
        { value: operations.group.combineBy, numberOfBits: 2 },
        { value: operations.group.combineInto, numberOfBits: 1 },
        { value: operations.group.combineAcrossGroups, numberOfBits: 1 },

        { value: operations.filter.filterSkipsBy, numberOfBits: 2 },
        { value: operations.filter.searchBy, numberOfBits: 2 },
        
        hashGroupSort(operations.sort.sortGroupsBy),
        { value: operations.sort.sortItemsBy, numberOfBits: 3 },
        { value: operations.sort.sortItemsAscending, numberOfBits: 1 },

        { value: operations.info.primaryInfo, numberOfBits: 3 },
        { value: (operations.info.secondaryInfo ?? -1) + 1, numberOfBits: 3 },
        hashPercentInfo(operations.info.primaryPercent),

        { value: operations.viewOptions.showSearch, numberOfBits: 1 },
        { value: operations.viewOptions.showItems, numberOfBits: 1 },
        { value: operations.viewOptions.showItemRanks, numberOfBits: 1 },
        { value: operations.viewOptions.showGroupSum, numberOfBits: 1 },
        { value: operations.viewOptions.previewGroups, numberOfBits: 1 },
    ]
    const numberOfBits = countBits(segments)
    const asBigint = segmentsToHashBigint(segments)
    if(inBinary == true) return asBigint.toString(2).padStart(numberOfBits, '0')
    const hashString = version + asBigint.toString(36).padStart(numberOfBits / 5, '0')
    const minString = `m${operations.filter.minimumPlays}`
    if(DEBUG && JSON.stringify(operations) != JSON.stringify(parseHash(hashString))) throw Error(`Incorrect hashing/unhashing algorithm: operations = ${JSON.stringify(operations, null, 2)}, unhashed = ${JSON.stringify(parseHash(hashString), null, 2)}`)
    return hashString + minString
}

function parseBigInt(str: string, radix: number): bigint {
    return str.split('').reduceRight((acc, c, index) => { 
        const numAtIndex = parseInt(c, radix)
        const newNum = acc + (BigInt(numAtIndex) * BigInt(Math.pow(radix, str.length - index - 1)))
        return newNum
    }, BigInt(0))
}

export function parsePresetHash(hash: string) {

}
export function parseHash(hash: string): Operations {
    const operations: Operations = JSON.parse(JSON.stringify(defaultPresets[0].operations));
    const version = parseInt(hash.at(0)!, 36)
    const minSeparatorIndex = hash.lastIndexOf('m')
    const operationsHash = hash.substring(1, minSeparatorIndex)
    const hashNumber = parseBigInt(operationsHash, 36)
    if(DEBUG && operationsHash != hashNumber.toString(36).padStart(operationsHash.length, '0')) throw Error(`parseBigInt not working: operationsHash = ${operationsHash}, hashNumber = ${hashNumber.toString(36).padStart(operationsHash.length, '0')}`)
    let segments: HashSegmentSetter[]
    switch(version) {
        case 1: {
            segments = [
                { setter: (n) => applyGroupType(n, operations.group.groupBy), numberOfBits: 8 },
                { setter: (n) => operations.group.combineBy = n as CombineType, numberOfBits: 2 },
                { setter: (n) => operations.group.combineInto = n as CombineInto, numberOfBits: 1 },
                { setter: (n) => operations.group.combineAcrossGroups = !!n, numberOfBits: 1 },
        
                { setter: (n) => operations.filter.filterSkipsBy = n as SkipFilterType, numberOfBits: 2 },
                { setter: (n) => operations.filter.searchBy = n as SearchType, numberOfBits: 2 },
                
                applyGroupSort(operations.sort.sortGroupsBy),
                { setter: (n) => operations.sort.sortItemsBy = n as ItemSortType, numberOfBits: 3 },
                { setter: (n) => operations.sort.sortItemsAscending = !!n, numberOfBits: 1 },
        
                { setter: (n) => operations.info.primaryInfo = n, numberOfBits: 3 },
                { setter: (n) => operations.info.secondaryInfo = (n == 0 ? null : n - 1 as InfoType), numberOfBits: 3 },
                parsePercentInfo(operations.info.primaryPercent),
                
                { setter: (n) => operations.viewOptions.showSearch = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showItems = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showItemRanks = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.showGroupSum = !!n, numberOfBits: 1 },
                { setter: (n) => operations.viewOptions.previewGroups = !!n, numberOfBits: 1 },        
            ]
            break
        }
        default: throw Error(`unsupported version: ${version}`)
    }
    applyHashBigintToSegments(hashNumber, segments)

    const min = parseInt(hash.substring(minSeparatorIndex + 1))
    operations.filter.minimumPlays = min
    
    return operations
}

function hashPercentInfo(percentInfo: PercentInfo): HashSegment {
    const segments: HashSegment[] = [
        { value: percentInfo.numerator, numberOfBits: 2 },
        { value: percentInfo.denominator, numberOfBits: 2 },
        { value: percentInfo.grouping, numberOfBits: 1 },
        { value: percentInfo.of, numberOfBits: 1 },
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}
function parsePercentInfo(percentInfo: PercentInfo): HashSegmentSetter {
    const segments: HashSegmentSetter[] = [
        { setter: (n) => percentInfo.numerator = n, numberOfBits: 2 },
        { setter: (n) => percentInfo.denominator = n, numberOfBits: 2 },
        { setter: (n) => percentInfo.grouping = n, numberOfBits: 1 },
        { setter: (n) => percentInfo.of = n, numberOfBits: 1 },
    ]
    return { setter: (n) => applyHashToSegments(n, segments), numberOfBits: countBits(segments) }   
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

function applyGroupType(hash: number, groupType: GroupType) {
    const segments: HashSegmentSetter[] = [
        { setter: (n) => groupType.hour = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.dayOfWeek = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.date = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.month = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.year = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.artist = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.song = !!n, numberOfBits: 1 },
        { setter: (n) => groupType.album = !!n, numberOfBits: 1 },
    ]
    applyHashToSegments(hash, segments)
}

function hashGroupSort(sortOrder: GroupSortOrder): HashSegment {
    const segments: HashSegment[] = [
        hashGroupSortOrder(sortOrder),
        hashGroupSortDirections(sortOrder)
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}

function applyGroupSort(sortOrder: GroupSortOrder): HashSegmentSetter {
    const segments: HashSegmentSetter[] = [
        applyGroupSortOrder(sortOrder),
        applyGroupSortDirections(sortOrder),
    ]
    return { setter: (n) => applyHashToSegments(n, segments), numberOfBits: countBits(segments) }   
}

function hashGroupSortOrder(sortOrder: GroupSortOrder): HashSegment {
    const hashed = hashSortedIndices(Object.entries(sortOrder).map(([k, v]) => v.index))
    const sortEntries = Object.keys(sortOrder).length
    if(DEBUG && hashed > factorial(sortEntries)) throw Error(`hashed sort order = ${hashed} too large, max is ${sortEntries}! = ${factorial(sortEntries)}`)
    return { value: hashed, numberOfBits: factorial(sortEntries).toString(2).length }
}

function applyGroupSortOrder(sortOrder: GroupSortOrder): HashSegmentSetter {
    const keys = Object.keys(sortOrder)
    const numberOfBits = factorial(keys.length).toString(2).length
    return { 
        setter: (n) => {
            const unhashed = unhashSortedIndices(n, keys)
            unhashed.forEach(k => sortOrder[k.key as keyof GroupSortOrder].index = k.index)
        },
        numberOfBits: numberOfBits,
    }
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
        { value: sortOrder.plays.isAscending, numberOfBits: 1 },
        { value: sortOrder.playtime.isAscending, numberOfBits: 1 },
        { value: sortOrder.percent.isAscending, numberOfBits: 1 },
    ]
    return { value: segmentsToHashNumber(segments), numberOfBits: countBits(segments)}
}

function applyGroupSortDirections(sortOrder: GroupSortOrder): HashSegmentSetter {
    const segments: HashSegmentSetter[] = [
        { setter: (n) => sortOrder.hour.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.dayOfWeek.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.date.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.month.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.year.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.artist.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.song.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.album.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.plays.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.playtime.isAscending = !!n, numberOfBits: 1 },
        { setter: (n) => sortOrder.percent.isAscending = !!n, numberOfBits: 1 },
    ]
    return { setter: (n) => applyHashToSegments(n, segments), numberOfBits: countBits(segments) }
}