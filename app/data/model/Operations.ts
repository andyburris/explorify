import { ViewOptions } from "./ViewOptions";

export interface Operations {
    group: GroupOperation,
    filter: FilterOperation,
    sort: SortOperation,
    viewOptions: ViewOptions,
}

export interface GroupType {
    hour: boolean,
    dayOfWeek: boolean,
    date: boolean,
    month: boolean,
    year: boolean,
    artist: boolean,
    song: boolean,
    album: boolean,
}
export enum CombineType { None, SameSong, SameArtist }
export enum CombineInto { EarliestPlay, LatestPlay }
export interface GroupOperation {
    groupBy: GroupType,
    combineBy: CombineType,
    combineAcrossGroups: boolean,
    combineInto: CombineInto,
}

export interface GroupSortOrderItem {
    index: number,
    isAscending: boolean,
}
export interface GroupSortOrder {
    hour: GroupSortOrderItem,
    dayOfWeek: GroupSortOrderItem,
    date: GroupSortOrderItem,
    month: GroupSortOrderItem,
    year: GroupSortOrderItem,
    artist: GroupSortOrderItem,
    song: GroupSortOrderItem,
    album: GroupSortOrderItem,
    totalPlays: GroupSortOrderItem,
    totalPlaytime: GroupSortOrderItem,
}
export enum ItemSortType { Date, Plays, Name, ArtistName }
export interface SortOperation {
    sortGroupsBy: GroupSortOrder,
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
