import { defaultPresets } from "./Defaults";
import { GroupType } from "./model/Group";
import { CombineInto, CombineType, GroupSortType, ItemSortType, Operations, SearchType, SkipFilterType } from "./model/Operations";
import { ViewInfoType } from "./model/ViewOptions";

export function hashOperations(operations: Operations, inBinary?: boolean): string {
    const version = '1' //increment the first character each version upgrade to ensure breaking changes are handled
    const segments: HashSegment[] = [
        { value: operations.group.groupBy, numberOfBits: 3 },
        { value: operations.group.combineBy, numberOfBits: 2 },
        { value: operations.group.combineInto, numberOfBits: 1 },
        { value: operations.group.combineAcrossGroups, numberOfBits: 1 },

        { value: operations.filter.filterSkipsBy, numberOfBits: 2 },
        { value: operations.filter.searchBy, numberOfBits: 2 },
        { value: operations.filter.rerankSearch, numberOfBits: 1 },
        
        { value: operations.sort.sortGroupsBy, numberOfBits: 1 },
        { value: operations.sort.sortGroupsAscending, numberOfBits: 1 },
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
    const asNumber = segmentsToHashNumber(segments)
    if(inBinary == true) return asNumber.toString(2).padStart(12, '0')
    return version + asNumber.toString(36).padStart(5, '0')
}

function parseHash(hash: string): Operations {
    const operations: Operations = defaultPresets[0].operations;
    const version = hash.at(0)
    switch(version) {
        case '1': {
            const segments: HashSegmentSetter[] = [
                { setter: (n) => operations.group.groupBy = n as GroupType, numberOfBits: 3 },
                { setter: (n) => operations.group.combineBy = n as CombineType, numberOfBits: 2 },
                { setter: (n) => operations.group.combineInto = n as CombineInto, numberOfBits: 1 },
                { setter: (n) => operations.group.combineAcrossGroups = !!n, numberOfBits: 1 },
        
                { setter: (n) => operations.filter.filterSkipsBy = n as SkipFilterType, numberOfBits: 2 },
                { setter: (n) => operations.filter.searchBy = n as SearchType, numberOfBits: 2 },
                { setter: (n) => operations.filter.rerankSearch = !!n, numberOfBits: 1 },
                
                { setter: (n) => operations.sort.sortGroupsBy = n as GroupSortType, numberOfBits: 1 },
                { setter: (n) => operations.sort.sortGroupsAscending = !!n, numberOfBits: 1 },
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
}

interface HashSegment { value: number | boolean, numberOfBits: number }
interface HashSegmentSetter { setter: (value: number) => void, numberOfBits: number }
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