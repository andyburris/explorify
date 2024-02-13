import { ViewOptions } from "./ViewOptions";

export interface Operations {
    group: GroupOperation,
    filter: FilterOperation,
    sort: SortOperation,
    info: InfoOperation,
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
    plays: GroupSortOrderItem,
    playtime: GroupSortOrderItem,
    percent: GroupSortOrderItem,
}
export enum ItemSortType { Date, Plays, Name, ArtistName, Playtime }
export interface SortOperation {
    sortGroupsBy: GroupSortOrder,
    sortItemsBy: ItemSortType,
    sortItemsAscending: boolean,
}

export enum SkipFilterType { All, NoSkips, OnlySkips }
export enum SearchType { All, SongName, ArtistName, AlbumName }
export interface FilterOperation {
    filterSkipsBy: SkipFilterType,
    minimumPlays: number,
    searchTerm: string,
    searchBy: SearchType,
}

export enum InfoType {
    Date,
    Plays,
    Playtime,
    Percent,
    Fraction,
}
export interface InfoOperation {
    primaryInfo: InfoType,
    primaryPercent: PercentInfo,
    secondaryInfo: InfoType | null,
}

export enum PercentOf { Plays, Playtime }
export enum PercentNumerator { All, Skipped, Searched }
export enum PercentDenominator { All, SkipFilter, SearchFilter }
export enum PercentGrouping { Total, Groups }
export interface PercentInfo {
    of: PercentOf,
    numerator: PercentNumerator,
    denominator: PercentDenominator,
    grouping: PercentGrouping,
}