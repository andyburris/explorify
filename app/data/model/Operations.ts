import { GroupType } from "./Group";
import { ViewOptions } from "./ViewOptions";

export interface Operations {
    group: GroupOperation,
    filter: FilterOperation,
    sort: SortOperation,
    viewOptions: ViewOptions,
}

export enum CombineType { None, SameSong, SameArtist }
export enum CombineInto { EarliestPlay, LatestPlay }
export interface GroupOperation {
    groupBy: GroupType,
    combineBy: CombineType,
    combineAcrossGroups: boolean,
    combineInto: CombineInto,
}

export enum GroupSortType { Date, Plays }
export enum ItemSortType { Date, Plays, Name, ArtistName }
export interface SortOperation {
    sortGroupsBy: GroupSortType,
    sortGroupsAscending: boolean,
    sortItemsBy: ItemSortType,
    sortItemsAscending: boolean,
}

export enum SkipFilterType { All, NoSkips, OnlySkips }
export enum SearchType { All, SongName, ArtistName }
export interface FilterOperation {
    filterSkipsBy: SkipFilterType,
    searchTerm: string,
    searchBy: SearchType,
    rerankSearch: boolean,
}